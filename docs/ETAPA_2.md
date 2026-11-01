# Etapa 2 — Backend e Gemini

Verificada em **01/11/2026**. Esta etapa entrega a API local; não inclui interface ou publicação em produção.

## O que funciona

- `GET /saude`: 200 com `{ "status": "ok" }`, sem chamada à IA.
- `POST /perguntar`: valida a pergunta e o texto, chama Gemini e devolve `{ "resposta": "..." }`.
- Pergunta obrigatória, até 1.000 caracteres; texto opcional, até 12.000. Espaços nas bordas são removidos após a validação do tamanho; campos extras não são encaminhados.
- Erros públicos em português, sem corpo bruto do provedor, stack ou configuração privada.
- Tratamento de cota, configuração ausente, acesso/modelo indisponível, conteúdo bloqueado, resposta vazia ou truncada, falha de rede e timeout de 25 segundos.
- A IA recebe instrução de estudo separada da entrada em JSON. Isso orienta o comportamento, mas não garante que o modelo nunca siga instruções maliciosas no texto. Ele não possui ferramentas, busca ou acesso ao ambiente.

## Mudança do modelo e chamada real

O modelo inicialmente previsto (`gemini-2.5-flash-lite`) apareceu na listagem da conta, mas a geração retornou HTTP 404. A documentação oficial informa restrições de acesso a modelos 2.5 para projetos novos. Não foi possível concluir apenas pelo 404 qual restrição se aplicou à conta.

O `gemini-3.5-flash-lite` estava disponível, tinha entrada e saída gratuitas no Free Tier na [tabela oficial](https://ai.google.dev/gemini-api/docs/pricing) e respondeu ao teste real. Por isso ele passou a ser o padrão configurável no `.env.example` e no serviço. Não há fallback automático na aplicação e nenhum faturamento foi ativado. A condição de conta gratuita foi informada pelo autor; disponibilidade e limites continuam sujeitos ao provedor.

A chave autorizada foi configurada apenas no `.env` local ignorado pelo Git. Ela não faz parte dos exemplos ou testes.

## Evidências

- **53 testes automatizados aprovados**, com IA simulada e sem consumo de cota.
- **100% de cobertura** da lógica de aplicação, validação, erros e integração: linhas, instruções, funções e ramificações. O mínimo configurado é 70% em cada métrica.
- `server.js` não entra nessa cobertura: apenas abre a porta. A inicialização foi verificada separadamente em processo real, usando porta livre e encerrando o processo ao final.
- Verificação HTTP real: `/saude` retornou 200; pergunta em branco retornou 400; pergunta válida com texto percorreu rota → validação → Gemini real → resposta e retornou 200.

Texto usado no teste real:

> A integração contínua executa testes a cada alteração. A entrega contínua mantém o sistema pronto para publicação.

Pergunta: “Resuma em dois tópicos curtos.” A resposta distinguiu integração contínua e entrega contínua, de acordo com o texto.

## Como revisar

1. Na raiz, execute `npm ci` e `npm run test:coverage:backend`.
2. Abra `backend/coverage/index.html` para consultar o relatório detalhado.
3. Execute `npm run start:backend` e consulte `http://127.0.0.1:3000/saude`.
4. Use o exemplo de POST do README para fazer uma pergunta real. Esse passo utiliza a cota do Gemini.
5. Encerre o servidor com Ctrl+C.

O relatório local não é um badge de CI. O workflow GitHub Actions será criado na etapa 4; o frontend e a URL pública ainda estão pendentes.
