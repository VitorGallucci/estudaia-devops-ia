# Backend EstudaIA

API Express 5 com chamadas ao Gemini pela API REST oficial e `fetch` do Node.js 22. Execute os comandos na raiz do repositório.

```powershell
npm ci
npm run start:backend
```

O comando carrega o `.env` da raiz, caso exista. Sem chave, `/saude` funciona normalmente e `/perguntar` retorna 503 com código `IA_NAO_CONFIGURADA`. Não há resposta falsa de demonstração.

## Organização

- `src/app.js`: cria a aplicação, configura JSON e rotas, e normaliza erros. Recebe o serviço `answerQuestion` por injeção, permitindo testes sem Gemini.
- `src/validation.js`: valida tipos e limites e seleciona somente os campos esperados.
- `src/gemini.js`: monta instrução de sistema e entrada em JSON, chama o provedor e interpreta a resposta. O timeout de 25 segundos abrange a requisição e a leitura do corpo; o timer é liberado ao concluir.
- `src/errors.js`: erro com status, código e mensagem pública.
- `src/server.js`: inicia a porta local. Importar `app.js` não abre um servidor.

O modelo padrão é `gemini-3.5-flash-lite`. A chave vai no cabeçalho `x-goog-api-key`, nunca na URL. O backend não registra os prompts, as respostas ou a configuração privada em logs. Não há repetição automática, busca externa, ferramentas ou fallback para outro modelo.

## Testes

```powershell
npm run test:backend
npm run test:coverage:backend
```

Supertest verifica as rotas HTTP; Vitest simula o serviço e o `fetch`. Os testes do timeout usam relógio simulado, sem aguardar 25 segundos reais. O relatório HTML é gerado em `backend/coverage/index.html`.

A cobertura inclui toda a lógica em `src`, exceto `server.js`, cujo início e encerramento foram verificados separadamente. Configuração do teste, dependências e arquivos de teste não entram na cobertura.
