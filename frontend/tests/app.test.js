import { beforeEach, describe, expect, it, vi } from 'vitest';
import html from '../index.html?raw';
import { mountApp } from '../src/app.js';

const get = (id) => document.getElementById(id);
const type = (id, value) => {
  get(id).value = value;
  get(id).dispatchEvent(new Event('input', { bubbles: true }));
};
const submit = () => get('estudo').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
const flush = async () => { await new Promise((resolve) => setTimeout(resolve, 0)); };

beforeEach(() => {
  document.documentElement.innerHTML = html.replace(/<!doctype html>/i, '');
});

describe('Interface de estudos', () => {
  it('inicia com rótulos, limites, contadores e estado vazio', () => {
    mountApp(document);
    expect(get('texto').maxLength).toBe(12000);
    expect(get('pergunta').maxLength).toBe(1000);
    expect(get('pergunta').required).toBe(true);
    expect(get('texto').labels[0].textContent).toContain('Seu material');
    expect(get('copiar').disabled).toBe(true);
    expect(get('empty-state').hidden).toBe(false);
    type('texto', 'a'.repeat(1200));
    type('pergunta', 'CI?');
    expect(get('texto-contador').textContent).toBe('1.200 / 12.000');
    expect(get('pergunta-contador').textContent).toBe('3 / 1.000');
  });

  it('o resumo exige texto e apenas prepara a pergunta, sem consumir IA', () => {
    const ask = vi.fn();
    mountApp(document, { ask });
    get('resumir').click();
    expect(get('texto').validationMessage).toContain('Cole um texto');
    type('texto', 'Material de estudo');
    get('resumir').click();
    expect(get('texto').validationMessage).toBe('');
    expect(get('pergunta').value).toContain('Resuma este texto');
    expect(document.activeElement).toBe(get('pergunta'));
    expect(ask).not.toHaveBeenCalled();
  });

  it('os exemplos preenchem a pergunta e atualizam o contador', () => {
    mountApp(document);
    const example = document.querySelector('[data-question]');
    example.click();
    expect(get('pergunta').value).toBe(example.dataset.question);
    expect(get('pergunta-contador').textContent).toBe(`${example.dataset.question.length} / 1.000`);
  });

  it.each([
    ['', '', 'pergunta'], ['   ', '', 'pergunta'], ['a'.repeat(1001), '', 'pergunta'],
    ['Resumo', 'a'.repeat(12001), 'texto'],
  ])('não envia dados inválidos (caso %#)', (question, text, invalidField) => {
    const ask = vi.fn();
    mountApp(document, { ask });
    type('pergunta', question);
    type('texto', text);
    submit();
    expect(ask).not.toHaveBeenCalled();
    expect(get(invalidField).validationMessage.length).toBeGreaterThan(0);
  });

  it('envia dados, bloqueia duplicatas e apresenta a resposta como texto seguro', async () => {
    let resolve;
    const ask = vi.fn(() => new Promise((done) => { resolve = done; }));
    mountApp(document, { ask });
    type('pergunta', '  Explique CI  ');
    type('texto', '  Material  ');
    submit();
    submit();
    expect(ask).toHaveBeenCalledExactlyOnceWith({ pergunta: 'Explique CI', texto: 'Material' });
    expect(get('loading-state').hidden).toBe(false);
    expect(get('enviar').disabled).toBe(true);
    expect(get('limpar').disabled).toBe(true);
    expect(get('texto').disabled).toBe(true);
    expect(document.querySelector('.output-panel').getAttribute('aria-busy')).toBe('true');
    resolve('<img src=x onerror=alert(1)>\nResposta da IA');
    await flush();
    expect(get('resposta').textContent).toContain('<img');
    expect(get('resposta').querySelector('img')).toBeNull();
    expect(get('answer-wrapper').hidden).toBe(false);
    expect(get('loading-state').hidden).toBe(true);
    expect(get('copiar').disabled).toBe(false);
    expect(get('enviar').disabled).toBe(false);
    expect(document.activeElement).toBe(get('resposta'));
    expect(document.querySelector('.output-panel').getAttribute('aria-busy')).toBe('false');
  });

  it('permite perguntar sem texto, copiar e limpar', async () => {
    const clipboard = { writeText: vi.fn().mockResolvedValue(undefined) };
    mountApp(document, { ask: vi.fn().mockResolvedValue('Uma resposta'), clipboard });
    type('pergunta', 'DevOps?');
    submit();
    await flush();
    get('copiar').click();
    await flush();
    expect(clipboard.writeText).toHaveBeenCalledWith('Uma resposta');
    expect(get('status').textContent).toBe('Resposta copiada!');
    get('limpar').click();
    expect(get('pergunta').value).toBe('');
    expect(get('resposta').textContent).toBe('');
    expect(get('pergunta-contador').textContent).toBe('0 / 1.000');
    expect(get('answer-wrapper').hidden).toBe(true);
    expect(get('empty-state').hidden).toBe(false);
    expect(get('copiar').disabled).toBe(true);
    expect(document.activeElement).toBe(get('texto'));
  });

  it.each([new Error('O limite de uso da IA foi atingido.'), 'falha inesperada'])('mostra erro e permite nova tentativa (caso %#)', async (error) => {
    const ask = vi.fn().mockRejectedValueOnce(error).mockResolvedValueOnce('Agora funcionou');
    mountApp(document, { ask });
    type('pergunta', 'CI?');
    submit();
    await flush();
    expect(get('erro').hidden).toBe(false);
    expect(get('erro').textContent.length).toBeGreaterThan(0);
    expect(get('pergunta').value).toBe('CI?');
    expect(get('enviar').disabled).toBe(false);
    expect(get('copiar').disabled).toBe(true);
    submit();
    await flush();
    expect(get('erro').hidden).toBe(true);
    expect(get('resposta').textContent).toBe('Agora funcionou');
  });

  it.each([undefined, { writeText: vi.fn().mockRejectedValue(new Error('sem permissão')) }])('orienta cópia manual se clipboard indisponível (caso %#)', async (clipboard) => {
    mountApp(document, { ask: vi.fn().mockResolvedValue('Resposta'), clipboard });
    type('pergunta', 'CI?');
    submit();
    await flush();
    get('copiar').click();
    await flush();
    expect(get('status').textContent).toContain('copie pelo teclado');
    expect(get('resposta').textContent).toBe('Resposta');
  });
});
