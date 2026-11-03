# EstudaIA

[![CI - testes e build](https://github.com/VitorGallucci/estudaia-devops-ia/actions/workflows/ci.yml/badge.svg?branch=main&event=push)](https://github.com/VitorGallucci/estudaia-devops-ia/actions/workflows/ci.yml)

Assistente de estudos com IA Generativa desenvolvido por Vitor Gallucci para a disciplina Desafio DevOps e IA da pós-graduação PUCPR.

O objetivo é permitir que uma pessoa cole um texto, peça um resumo e faça perguntas sobre o conteúdo. Também será possível tirar dúvidas sem fornecer texto.

**Aplicação publicada:** [estudaia-devops-ia.vercel.app](https://estudaia-devops-ia.vercel.app) · [Saúde da API](https://estudaia-devops-ia.vercel.app/saude)

## Estado atual

**Etapa 5 de 6 — Publicação na Vercel.** Frontend e API estão disponíveis na mesma URL pública, com duas perguntas reais verificadas no navegador. O projeto está no plano Hobby, com chave Gemini restrita à produção. O GitHub Actions executa 81 testes com mock, exige cobertura mínima de 70% em cada aplicação e compila a interface. A Vercel exige a aprovação do job de qualidade antes de promover novas versões para produção. Consulte as [evidências do backend](docs/ETAPA_2.md), da [interface](docs/ETAPA_3.md), do [pipeline](docs/ETAPA_4.md) e da [publicação](docs/ETAPA_5.md).

## Tecnologias

- Frontend: HTML, CSS e JavaScript com Vite.
- Backend: Node.js e Express, com acesso ao Gemini por `fetch`.
- Testes: Vitest, cobertura V8, Supertest e ambiente DOM.
- Automação: GitHub Actions; hospedagem: Vercel Hobby.
- Sem banco de dados, cadastro ou histórico permanente de conversas.

## Estrutura

```text
backend/     API Express, serviço Gemini e testes
frontend/    interface HTML/CSS/JavaScript, Vite e testes DOM
api/         adaptador que exporta a aplicação Express para a Vercel
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

Em outro terminal, na mesma pasta, inicie a interface:

```powershell
npm run dev:frontend
```

Abra `http://127.0.0.1:5173`. O Vite encaminha `/perguntar` e `/saude` para o backend em `127.0.0.1:3000`, mantendo a mesma origem no navegador. Caso use outra porta no backend, ajuste o destino no `frontend/vite.config.js`. Nenhuma chave vai para o navegador.

Cole um texto e clique em **Resumir este texto** para preencher a pergunta; clique em **Enviar pergunta** para chamar a IA. Também é possível perguntar sem texto. **Copiar resposta** copia o texto recebido; **Limpar** apaga o formulário e a resposta. A aplicação não guarda histórico após recarregar a página.

Para gerar os arquivos estáticos da interface:

```powershell
npm run build
```

O resultado fica em `frontend/dist`, ignorado pelo Git. Na Vercel, `vercel.json` combina esses arquivos estáticos com a função `api/index.js`, que exporta a mesma aplicação Express do backend. As rotas `/saude` e `/perguntar` são encaminhadas a essa função.

## Testes de toda a aplicação

```powershell
npm test
npm run test:coverage
```

Os comandos executam ambos os workspaces, com IA simulada. Relatórios HTML separados: `backend/coverage/index.html` e `frontend/coverage/index.html`. A configuração exige pelo menos 70% em cada uma das quatro métricas, separadamente por aplicação.

## Pipeline no GitHub Actions

O workflow [CI - testes e build](https://github.com/VitorGallucci/estudaia-devops-ia/actions/workflows/ci.yml), definido em `.github/workflows/ci.yml`, roda em pushes, pull requests para `main` e acionamento manual. Ele utiliza Ubuntu e Node.js 22, instala pelo lockfile, verifica a estrutura, executa testes com cobertura e gera o build. Se os testes ou os limites de cobertura falharem, o pipeline falha e a compilação seguinte é bloqueada.

O badge no início deste README reflete o resultado real dos pushes na branch `main`: verde (`passing`) indica que a última execução terminou com sucesso. Clique nele para ver as execuções e seus logs. O badge não comprova disponibilidade da IA ou da aplicação em produção.

Ao abrir uma execução, a seção **Artifacts** contém `cobertura-backend`, `cobertura-frontend` e `build-frontend`, com retenção de 14 dias. Extraia o ZIP de cobertura e abra `index.html` para navegar pelo relatório. O download pode exigir login no GitHub.

O CI usa mocks, com `GEMINI_API_KEY` vazia, e não recebe a chave real. As actions oficiais estão fixadas por SHA e o token do workflow tem somente leitura do código.

Na etapa 5: backend com 55 testes e 100% nas quatro métricas; frontend com 26 testes, 100% em linhas/funções, 96,82% em instruções e 90,47% em ramificações. O frontend usa testes DOM para validar o comportamento, além da inspeção no navegador em desktop e tela pequena.

## Publicação contínua

A Vercel está conectada à branch `main` deste repositório. Ao receber um push, prepara uma versão e consulta o check **Testes, cobertura e build** do GitHub Actions para o mesmo commit. A configuração **Deployment Checks** exige esse check na produção; a versão só recebe o domínio público após a aprovação. Um teste ou uma cobertura reprovada impede a promoção daquela versão.

Essa configuração usa a integração Git nativa com a Vercel, conforme a [documentação de Deployment Checks](https://vercel.com/docs/deployment-checks). O GitHub Actions executa a qualidade; a Vercel constrói e publica após sua aprovação. Não há token pessoal de deploy armazenado no GitHub. O build da Vercel pode ocorrer enquanto os testes rodam; a barreira controla a publicação no domínio de produção.

O projeto usa Node.js 22, raiz do repositório, comando `npm run build`, saída `frontend/dist` e a função `api/index.js`. Na Vercel, configure `GEMINI_API_KEY` como segredo de Production e `GEMINI_MODEL=gemini-3.5-flash-lite`. A função tem limite de 60 segundos e a chamada ao Gemini mantém seu timeout de 25 segundos. Os detalhes para reproduzir a configuração e revisar a publicação estão na [etapa 5](docs/ETAPA_5.md).

## Testes do backend

```powershell
npm run test:backend
npm run test:coverage:backend
```

Os testes usam serviço injetado e `fetch` simulado, sem ler o `.env` ou consumir Gemini. O relatório HTML fica em `backend/coverage/index.html` (não versionado). A configuração exige pelo menos 70% em linhas, funções, instruções e ramificações. O módulo `server.js`, que apenas abre a porta, fica fora da cobertura; foi verificado separadamente com requisições HTTP reais. O bootstrap `frontend/src/main.js`, que apenas importa CSS e monta a interface, também fica fora da cobertura e foi verificado no navegador.

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

O badge está ligado ao workflow real do GitHub Actions e a cobertura mínima de 70% é exigida em cada aplicação. O arquivo `DECISOES.md`, com no mínimo 200 palavras, será redigido a partir das decisões e dificuldades observadas e revisado pelo autor na etapa final.

IA é utilizada como assistente de desenvolvimento. O autor deverá compreender e explicar a implementação na demonstração individual.
