# EstudaIA

Assistente de estudos com IA Generativa desenvolvido por Vitor Gallucci para a disciplina Desafio DevOps e IA da pós-graduação PUCPR.

O objetivo é permitir que uma pessoa cole um texto, peça um resumo e faça perguntas sobre o conteúdo. Também será possível tirar dúvidas sem fornecer texto.

## Estado atual

**Etapa 1 de 6 — Fundação.** Estrutura e documentação inicial preparadas. A aplicação, os testes, o pipeline e o deploy serão implementados nas próximas etapas. Ainda não há URL de produção nem badge de sucesso.

## Tecnologias planejadas

- Frontend: HTML, CSS e JavaScript com Vite.
- Backend: Node.js e Express, com acesso ao Gemini por `fetch`.
- Testes: Vitest, cobertura V8, Supertest e ambiente DOM.
- Automação: GitHub Actions; hospedagem: Vercel Hobby.
- Sem banco de dados, cadastro ou histórico permanente de conversas.

## Estrutura

```text
backend/     API, validação e integração Gemini (etapa 2)
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

Na etapa de integração, copie `.env.example` para `.env` e preencha a chave localmente. O arquivo `.env` é ignorado pelo Git. Na produção, a chave será configurada no ambiente da Vercel. Nunca coloque chaves em variáveis com prefixo `VITE_`, pois elas podem ser incorporadas ao frontend.

## Contrato previsto da API

| Método e rota | Entrada | Saída de sucesso |
| --- | --- | --- |
| `GET /saude` | Nenhuma | `{ "status": "ok" }` |
| `POST /perguntar` | `{ "pergunta": "Resuma em tópicos", "texto": "Texto de estudo" }` | `{ "resposta": "Resumo gerado" }` |

`pergunta` será obrigatória, com até 1.000 caracteres; `texto` será opcional, com até 12.000 caracteres. O endpoint de saúde não consumirá IA.

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
