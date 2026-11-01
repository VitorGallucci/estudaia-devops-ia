import express from 'express';
import { AppError } from './errors.js';
import { validateQuestion } from './validation.js';

async function unavailableService() {
  throw new AppError(503, 'IA_NAO_CONFIGURADA', 'O serviço de IA ainda não está configurado.');
}

// Separada do listen: Supertest e Vercel reutilizam a mesma aplicação.
export function createApp({ answerQuestion = unavailableService } = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.use((_req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  });
  app.use(express.json({ limit: '100kb' }));

  app.get('/saude', (_req, res) => res.json({ status: 'ok' }));

  app.post('/perguntar', async (req, res) => {
    if (!req.is('application/json')) {
      throw new AppError(415, 'FORMATO_INVALIDO', 'Envie a pergunta como application/json.');
    }
    const input = validateQuestion(req.body);
    const resposta = await answerQuestion(input);
    res.json({ resposta });
  });

  app.use((_req, res) => {
    res.status(404).json({ erro: { codigo: 'ROTA_NAO_ENCONTRADA', mensagem: 'Rota não encontrada.' } });
  });

  // Os quatro argumentos identificam o middleware de erro do Express.
  app.use((error, _req, res, _next) => {
    if (error.type === 'entity.parse.failed') {
      error = new AppError(400, 'JSON_INVALIDO', 'O corpo da requisição deve conter JSON válido.');
    } else if (error.type === 'entity.too.large') {
      error = new AppError(413, 'CORPO_MUITO_GRANDE', 'A requisição ultrapassa o limite permitido.');
    }
    if (error instanceof AppError) {
      return res.status(error.status).json({ erro: { codigo: error.code, mensagem: error.message } });
    }
    return res.status(500).json({
      erro: { codigo: 'ERRO_INTERNO', mensagem: 'Não foi possível processar a solicitação.' },
    });
  });

  return app;
}
