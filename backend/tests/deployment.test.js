import request from 'supertest';
import { describe, expect, it } from 'vitest';
import app from '../../api/index.js';

describe('Adaptador da Vercel', () => {
  it('exporta a mesma aplicação HTTP e atende saúde sem abrir porta ao importar', async () => {
    const response = await request(app).get('/saude');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('mantém a validação e o contrato público de erros', async () => {
    const response = await request(app).post('/perguntar').send({ pergunta: '   ' });
    expect(response.status).toBe(400);
    expect(response.body.erro.codigo).toBe('PERGUNTA_INVALIDA');
  });
});
