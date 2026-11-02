# Etapa 3 — Interface conectada à API

Verificada em **02/11/2026**. A aplicação completa funciona localmente; publicação na Vercel continua prevista para a etapa 5.

## Funcionalidades

- Interface em português, com cores claras e detalhes azuis; painéis lado a lado em desktop e empilhados em telas menores.
- Material opcional (12.000 caracteres) e pergunta obrigatória (1.000), com contadores, rótulos, ajuda e mensagens de validação.
- Atalho de resumo e exemplos de perguntas. Esses botões apenas preenchem o campo; o usuário confirma o envio.
- POST para `/perguntar` na mesma origem. Em desenvolvimento, o proxy Vite encaminha à API local.
- Estados de espera, resposta e erro. Controles desabilitados durante a chamada impedem pedidos duplicados; os campos são preservados em caso de falha.
- Copiar resposta, com orientação para cópia manual se o navegador bloquear o clipboard; limpeza de campos e resposta.
- Resposta via `textContent`, preservando quebras de linha, sem executar HTML. Marcações Markdown aparecem literalmente.
- Sem chave no frontend ou armazenamento persistente de conversas.

## Evidências de verificação

História verificada: preencher texto/pergunta → enviar pela interface → proxy Vite → rota Express → Gemini real → JSON → resposta na tela.

| Verificação | Resultado |
| --- | --- |
| Build Vite | Aprovado; arquivos estáticos em `frontend/dist`. |
| Testes frontend | 26 aprovados, com serviço/HTTP simulados. |
| Cobertura frontend | Linhas e funções: 100%; instruções: 96,82%; ramificações: 90,47%. |
| Testes backend | 53 aprovados; 100% de cobertura da lógica nas quatro métricas. |
| Resumo com material | Pergunta enviada pela tela, resposta real do Gemini exibida. |
| Dúvida sem material | Exemplo sobre DevOps enviado e respondido pela IA na tela. |
| Carregamento | Botões e campos bloqueados enquanto a resposta era gerada. |
| Cópia e limpeza | Mensagem de cópia confirmada; limpeza restaurou campos e estado inicial. |
| Console no fluxo de resumo | Nenhum erro registrado pelo navegador. |
| Tela pequena | Verificada em viewport de 390 px, em uma coluna, sem rolagem horizontal. |

Os testes DOM cobrem entradas inválidas, limites, resumo sem material, exemplos, contadores, duplicação de envio, resposta como texto seguro, erro e nova tentativa, cópia indisponível e limpeza. Os testes do cliente HTTP cobrem contrato JSON, erro do backend, resposta inválida/vazia, rede e timeout.

As métricas medem JavaScript de aplicação: `app.js` e `api.js`. O bootstrap `main.js` não possui lógica própria e foi verificado no navegador; HTML e CSS foram inspecionados visualmente, sem alegar cobertura desses arquivos.

## Como revisar

1. Na raiz: `npm ci`.
2. Primeiro terminal: `npm run start:backend` (usa o `.env` local).
3. Segundo terminal: `npm run dev:frontend`.
4. Abra `http://127.0.0.1:5173`.
5. Cole um pequeno texto, clique em resumir e envie. Depois use limpar e faça uma pergunta sem material.
6. Execute `npm run test:coverage` para verificar ambos os workspaces sem consumir Gemini.

Relatórios: `backend/coverage/index.html` e `frontend/coverage/index.html`. O uso real da interface consome a cota da conta Gemini; nenhum pagamento foi configurado nesta etapa.

Os servidores usados para a verificação foram encerrados ao concluir o trabalho. Para revisar, inicie-os com os comandos acima. Pipeline, badge e produção permanecem para as próximas etapas.
