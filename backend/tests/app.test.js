import request from 'supertest';
import { describe, it, expect, vi } from 'vitest';
import { createApp } from '../src/app.js';
import { AppError } from '../src/errors.js';

describe('API EstudaIA', () => {
  it('informa saúde sem consumir IA nem divulgar configuração', async () => {
    const answerQuestion = vi.fn();
    const result = await request(createApp({ answerQuestion })).get('/saude');
    expect(result.status).toBe(200);
    expect(result.body).toEqual({ status: 'ok' });
    expect(result.headers['cache-control']).toBe('no-store');
    expect(result.headers['x-powered-by']).toBeUndefined();
    expect(answerQuestion).not.toHaveBeenCalled();
  });

  it.each([
    [{ pergunta: ' Explique CI ', texto: ' Texto base ', extra: 'ignorar' }, { pergunta: 'Explique CI', texto: 'Texto base' }],
    [{ pergunta: 'O que é DevOps?' }, { pergunta: 'O que é DevOps?', texto: '' }],
    [{ pergunta: 'a'.repeat(1000), texto: 'b'.repeat(12000) }, { pergunta: 'a'.repeat(1000), texto: 'b'.repeat(12000) }],
  ])('responde com IA simulada e encaminha apenas dados válidos', async (body, expected) => {
    const answerQuestion = vi.fn().mockResolvedValue('Resposta de estudo');
    const result = await request(createApp({ answerQuestion })).post('/perguntar').send(body);
    expect(result.status).toBe(200);
    expect(result.body).toEqual({ resposta: 'Resposta de estudo' });
    expect(answerQuestion).toHaveBeenCalledExactlyOnceWith(expected);
  });

  it.each([
    [{}, 'PERGUNTA_INVALIDA'],
    [{ pergunta: '' }, 'PERGUNTA_INVALIDA'],
    [{ pergunta: '   ' }, 'PERGUNTA_INVALIDA'],
    [{ pergunta: 123 }, 'PERGUNTA_INVALIDA'],
    [{ pergunta: 'a'.repeat(1001) }, 'PERGUNTA_LONGA'],
    [{ pergunta: 'Resumo', texto: null }, 'TEXTO_INVALIDO'],
    [{ pergunta: 'Resumo', texto: 42 }, 'TEXTO_INVALIDO'],
    [{ pergunta: 'Resumo', texto: 'a'.repeat(12001) }, 'TEXTO_LONGO'],
    [[], 'ENTRADA_INVALIDA'],
  ])('rejeita entrada inválida antes de chamar a IA (caso %#)', async (body, code) => {
    const answerQuestion = vi.fn();
    const result = await request(createApp({ answerQuestion })).post('/perguntar').send(body);
    expect(result.status).toBe(400);
    expect(result.body.erro.codigo).toBe(code);
    expect(answerQuestion).not.toHaveBeenCalled();
  });

  it('rejeita pergunta sem corpo', async () => {
    const result = await request(createApp()).post('/perguntar').set('Content-Type', 'application/json');
    expect(result.status).toBe(400);
  });

  it('rejeita conteúdo de formulário', async () => {
    const result = await request(createApp()).post('/perguntar').type('form').send({ pergunta: 'CI?' });
    expect(result.status).toBe(415);
    expect(result.body.erro.codigo).toBe('FORMATO_INVALIDO');
  });

  it('trata JSON malformado sem devolver o corpo enviado', async () => {
    const result = await request(createApp()).post('/perguntar').set('Content-Type', 'application/json').send('{"pergunta":');
    expect(result.status).toBe(400);
    expect(result.body.erro.codigo).toBe('JSON_INVALIDO');
  });

  it('limita o tamanho do corpo HTTP', async () => {
    const result = await request(createApp()).post('/perguntar').send({ pergunta: 'a'.repeat(110000) });
    expect(result.status).toBe(413);
  });

  it('retorna 404 em JSON', async () => {
    const result = await request(createApp()).get('/inexistente');
    expect(result.status).toBe(404);
    expect(result.body.erro.codigo).toBe('ROTA_NAO_ENCONTRADA');
  });

  it('preserva erros públicos conhecidos', async () => {
    const answerQuestion = vi.fn().mockRejectedValue(new AppError(429, 'LIMITE_IA', 'Tente mais tarde.'));
    const result = await request(createApp({ answerQuestion })).post('/perguntar').send({ pergunta: 'CI?' });
    expect(result.status).toBe(429);
    expect(result.body.erro.codigo).toBe('LIMITE_IA');
  });

  it('oculta detalhes de erros inesperados', async () => {
    const answerQuestion = vi.fn().mockRejectedValue(new Error('detalhe privado do provedor'));
    const result = await request(createApp({ answerQuestion })).post('/perguntar').send({ pergunta: 'CI?' });
    expect(result.status).toBe(500);
    expect(result.body.erro.codigo).toBe('ERRO_INTERNO');
    expect(result.text).not.toContain('privado');
    expect(result.body).not.toHaveProperty('stack');
  });

  it('informa serviço ainda não configurado', async () => {
    const result = await request(createApp()).post('/perguntar').send({ pergunta: 'CI?' });
    expect(result.status).toBe(503);
  });
});
