# EstudaIA

Assistente de estudos com IA Generativa desenvolvido por Vitor Gallucci para a disciplina Desafio DevOps e IA da pós-graduação PUCPR.

O objetivo é permitir que uma pessoa cole um texto, peça um resumo e faça perguntas sobre o conteúdo. Também será possível tirar dúvidas sem fornecer texto.

## Estado atual

**Etapa 2 de 6 — Backend e Gemini concluída.** API local com saúde, perguntas, validação, integração real e tratamento de erros. Os 53 testes automatizados passaram, com 100% de cobertura da lógica do backend. Interface, pipeline e publicação serão implementados nas próximas etapas; ainda não há URL de produção nem badge de sucesso. Consulte as [evidências e instruções da etapa 2](docs/ETAPA_2.md).

## Tecnologias planejadas

- Frontend: HTML, CSS e JavaScript com Vite.
- Backend: Node.js e Express, com acesso ao Gemini por `fetch`.
- Testes: Vitest, cobertura V8, Supertest e ambiente DOM.
- Automação: GitHub Actions; hospedagem: Vercel Hobby.
- Sem banco de dados, cadastro ou histórico permanente de conversas.

## Estrutura

```text
backend/     API Express, serviço Gemini e testes
frontend/    interface web (etapa 3)
api/         adaptador da API para Vercel (etapa 5)
docs/        planejamento e materiais da entrega
```

## Preparação local

Requisitos: Node.js 22 e npm 10 ou superior. No PowerShell, caso a política de execução bloqueie `npm`, utilize `npm.cmd`.

```powershell
npm ci
npm run check:structure
```

Esses comandos instalam o projeto pelo lockfile e verificam os diretórios e arquivos fundamentais. A verificação de estrutura não substitui os futuros testes de comportamento nem mede cobertura.

Copie `.env.example` para `.env` e preencha a chave localmente, caso ainda não tenha esse arquivo. Preserve um `.env` já configurado. O arquivo `.env` é ignorado pelo Git. Na produção, a chave será configurada no ambiente da Vercel. Nunca coloque chaves em variáveis com prefixo `VITE_`, pois elas podem ser incorporadas ao frontend.

| Variável | Uso |
| --- | --- |
| `GEMINI_API_KEY` | Chave privada; necessária apenas para responder perguntas. |
| `GEMINI_MODEL` | Modelo de texto; padrão `gemini-3.5-flash-lite`. |
| `PORT` | Porta local do backend; padrão `3000`. |

```powershell
npm run dev:backend
```

O backend fica em `http://127.0.0.1:3000`. Abra `/saude` para consultar a saúde; `/perguntar` recebe somente POST. Este endereço é para desenvolvimento e não substitui a URL pública da entrega. Para iniciar sem reinício automático, use `npm run start:backend`.

## Testes do backend

```powershell
npm run test:backend
npm run test:coverage:backend
```

Os testes usam serviço injetado e `fetch` simulado, sem ler o `.env` ou consumir Gemini. O relatório HTML fica em `backend/coverage/index.html` (não versionado). A configuração exige pelo menos 70% em linhas, funções, instruções e ramificações. O módulo `server.js`, que apenas abre a porta, fica fora da cobertura; foi verificado separadamente com requisições HTTP reais. A cobertura do frontend será adicionada após sua implementação.

## Contrato da API

| Método e rota | Entrada | Saída de sucesso |
| --- | --- | --- |
| `GET /saude` | Nenhuma | `{ "status": "ok" }` |
| `POST /perguntar` | `{ "pergunta": "Resuma em tópicos", "texto": "Texto de estudo" }` | `{ "resposta": "Resumo gerado" }` |

`pergunta` é obrigatória, com até 1.000 caracteres; `texto` é opcional, com até 12.000 caracteres. O endpoint de saúde não consome IA.

Envie `Content-Type: application/json`. Respostas de erro seguem `{ "erro": { "codigo": "...", "mensagem": "..." } }`. Erros de validação retornam 400; formato incorreto, 415; corpo excessivo, 413; conteúdo bloqueado, 422; limite do provedor, 429; falha externa, 502; configuração/indisponibilidade, 503; timeout de 25 segundos, 504. Erros inesperados retornam 500 sem detalhes internos. Requisições têm limite de 100 KB e respostas não são armazenadas em cache.

Exemplo no PowerShell, com o backend iniciado e a chave configurada:

```powershell
$dados = @{ pergunta = 'Explique o que é integração contínua em uma frase.' } | ConvertTo-Json
Invoke-RestMethod -Uri 'http://127.0.0.1:3000/perguntar' -Method Post -ContentType 'application/json; charset=utf-8' -Body ([System.Text.Encoding]::UTF8.GetBytes($dados))
```

## Segurança e custos

- A chave será utilizada exclusivamente no backend e não será versionada.
- Os testes usarão um mock da IA, sem chamadas externas e sem consumo de cota.
- O projeto utilizará a cota gratuita do Gemini, sem ativar faturamento ou fallback pago. Cotas podem impedir novas respostas quando esgotadas.
- A disponibilidade gratuita depende das condições da conta e do provedor: [preços Gemini](https://ai.google.dev/gemini-api/docs/pricing) e [faturamento](https://ai.google.dev/gemini-api/docs/billing).
- Não insira dados pessoais ou material confidencial nos exemplos. Revise as respostas geradas.

## Entrega acadêmica

Prazo: **07/11/2026 às 23h59, horário de Brasília**. Consulte [planejamento](docs/PLANEJAMENTO.md) e [checklist de entrega](docs/ENTREGA.md).

O badge será adicionado quando existir um workflow real. A cobertura mínima será de 70% em cada aplicação. O arquivo `DECISOES.md`, com no mínimo 200 palavras, será redigido a partir das decisões e dificuldades observadas e revisado pelo autor na etapa final.

IA é utilizada como assistente de desenvolvimento. O autor deverá compreender e explicar a implementação na demonstração individual.
