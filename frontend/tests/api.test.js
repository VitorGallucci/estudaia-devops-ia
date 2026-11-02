import { afterEach, describe, expect, it, vi } from 'vitest';
import { askQuestion } from '../src/api.js';

const input = { pergunta: 'CI?', texto: '' };
const response = (payload, ok = true) => ({ ok, json: vi.fn().mockResolvedValue(payload) });

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('Cliente HTTP', () => {
  it('chama somente a API da mesma origem com JSON', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(response({ resposta: 'Resposta real da API' }));
    expect(await askQuestion(input, { fetchImpl })).toBe('Resposta real da API');
    const [url, options] = fetchImpl.mock.calls[0];
    expect(url).toBe('/perguntar');
    expect(options.method).toBe('POST');
    expect(options.headers).toEqual({ 'Content-Type': 'application/json' });
    expect(JSON.parse(options.body)).toEqual(input);
    expect(options.signal).toBeInstanceOf(AbortSignal);
  });

  it('usa fetch global quando não injetado', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(response({ resposta: 'Ok' }));
    vi.stubGlobal('fetch', fetchImpl);
    expect(await askQuestion(input)).toBe('Ok');
  });

  it.each([
    [{ erro: { mensagem: 'Limite atingido' } }, 'Limite atingido'],
    [{}, 'Não foi possível obter a resposta'],
    [null, 'Não foi possível obter a resposta'],
  ])('traduz falhas da API (caso %#)', async (payload, message) => {
    const fetchImpl = vi.fn().mockResolvedValue(response(payload, false));
    await expect(askQuestion(input, { fetchImpl })).rejects.toThrow(message);
  });

  it.each([null, {}, { resposta: '' }, { resposta: '   ' }, { resposta: 12 }])('rejeita resposta vazia ou inválida (caso %#)', async (payload) => {
    const fetchImpl = vi.fn().mockResolvedValue(response(payload));
    await expect(askQuestion(input, { fetchImpl })).rejects.toThrow('resposta vazia');
  });

  it('trata JSON inválido e falha de rede', async () => {
    const invalid = vi.fn().mockResolvedValue({ json: () => Promise.reject(new SyntaxError('JSON')) });
    await expect(askQuestion(input, { fetchImpl: invalid })).rejects.toThrow('resposta inválida');
    const offline = vi.fn().mockRejectedValue(new TypeError('network'));
    await expect(askQuestion(input, { fetchImpl: offline })).rejects.toThrow('Verifique sua conexão');
  });

  it('cancela em 30 segundos e libera o timer', async () => {
    vi.useFakeTimers();
    const fetchImpl = vi.fn((_url, { signal }) => new Promise((_resolve, reject) => {
      signal.addEventListener('abort', () => reject(new Error('aborted')));
    }));
    const assertion = expect(askQuestion(input, { fetchImpl })).rejects.toThrow('demorou mais');
    await vi.advanceTimersByTimeAsync(30000);
    await assertion;
    expect(vi.getTimerCount()).toBe(0);
  });

  it('libera timer após sucesso', async () => {
    vi.useFakeTimers();
    const fetchImpl = vi.fn().mockResolvedValue(response({ resposta: 'Ok' }));
    await askQuestion(input, { fetchImpl });
    expect(vi.getTimerCount()).toBe(0);
  });
});
