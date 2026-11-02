export async function askQuestion(input, { fetchImpl = globalThis.fetch, timeoutMs = 30000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl('/perguntar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      signal: controller.signal,
    });
    let payload;
    try {
      payload = await response.json();
    } catch {
      throw new Error('O serviço retornou uma resposta inválida. Tente novamente mais tarde.');
    }
    if (!response.ok) {
      throw new Error(typeof payload?.erro?.mensagem === 'string'
        ? payload.erro.mensagem
        : 'Não foi possível obter a resposta. Tente novamente mais tarde.');
    }
    if (typeof payload?.resposta !== 'string' || !payload.resposta.trim()) {
      throw new Error('O serviço retornou uma resposta vazia. Tente reformular a pergunta.');
    }
    return payload.resposta;
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error('A resposta demorou mais que o esperado. Tente novamente.');
    }
    if (error instanceof TypeError) {
      throw new Error('Não foi possível conectar ao serviço. Verifique sua conexão e tente novamente.');
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
