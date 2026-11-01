import { AppError } from './errors.js';

export function validateQuestion(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new AppError(400, 'ENTRADA_INVALIDA', 'Envie um objeto JSON com a pergunta.');
  }

  if (typeof body.pergunta !== 'string' || !body.pergunta.trim()) {
    throw new AppError(400, 'PERGUNTA_INVALIDA', 'Digite uma pergunta.');
  }
  if (body.pergunta.length > 1000) {
    throw new AppError(400, 'PERGUNTA_LONGA', 'A pergunta deve ter até 1.000 caracteres.');
  }
  if (body.texto !== undefined && typeof body.texto !== 'string') {
    throw new AppError(400, 'TEXTO_INVALIDO', 'O texto de estudo deve ser uma string.');
  }
  if (body.texto !== undefined && body.texto.length > 12000) {
    throw new AppError(400, 'TEXTO_LONGO', 'O texto de estudo deve ter até 12.000 caracteres.');
  }

  // Somente os campos do contrato seguem para a IA.
  return { pergunta: body.pergunta.trim(), texto: (body.texto ?? '').trim() };
}
