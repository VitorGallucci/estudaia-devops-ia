# Adaptador Vercel

`index.js` exporta a aplicação Express criada em `backend/src/app.js`. A Vercel chama essa aplicação diretamente, sem executar `listen` ou manter um servidor local aberto.

Na raiz, `vercel.json` publica a interface de `frontend/dist` e reescreve `/saude` e `/perguntar` para a função. A lógica de validação e Gemini continua no backend, reutilizada em desenvolvimento, testes e produção.

O projeto da Vercel usa Node.js 22; a função tem limite de 60 segundos. O timeout interno do Gemini continua em 25 segundos. Não há chave no adaptador: o serviço recebe `GEMINI_API_KEY` do ambiente de produção.

Os testes em `backend/tests/deployment.test.js` verificam saúde e validação pela aplicação exportada. O encaminhamento das rotas foi verificado também na URL pública da Vercel, incluindo respostas reais do Gemini. Consulte [publicação](../docs/ETAPA_5.md).
