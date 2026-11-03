# Etapa 5 — Publicação na Vercel

Verificada em **03/11/2026**.

- Aplicação: **https://estudaia-devops-ia.vercel.app**
- Saúde da API: **https://estudaia-devops-ia.vercel.app/saude**
- Repositório: **https://github.com/VitorGallucci/estudaia-devops-ia**

## Arquitetura publicada

A interface estática é servida pelo CDN da Vercel. `api/index.js` exporta a aplicação Express do backend como função Node.js, sem abrir porta. `vercel.json` encaminha `/saude` e `/perguntar` a essa função, na mesma origem do frontend. A interface continua usando `fetch('/perguntar')`.

O build é executado na raiz, com `npm ci --no-audit --no-fund` e `npm run build`; a saída é `frontend/dist`. O projeto utiliza Node.js 22 e uma função com limite de 60 segundos. O timeout do provedor permanece em 25 segundos; o cliente tem limite de 30 segundos.

O projeto pertence à equipe `vitorgalluccis-projects`, no plano Hobby. Identificador do projeto: `prj_Yp4eSko7b2AWB0DnZSXoiNIE2HiX`. A aplicação usa o subdomínio gratuito `vercel.app`, sem compra de domínio ou upgrade de plano.

## Segredos

`GEMINI_API_KEY` foi cadastrado como Secret, restrito ao ambiente Production. `GEMINI_MODEL` está configurado como `gemini-3.5-flash-lite`. A chave não está no GitHub Actions, no adaptador, no frontend ou no histórico. O `.env` permanece ignorado pelo Git e `.vercelignore` também impede seu envio em uploads pela CLI.

Não foi ativado faturamento Gemini ou contratado recurso pago nesta etapa. O uso permanece sujeito aos limites gratuitos informados pelo autor e aos limites do plano Hobby.

## CI/CD e bloqueio de publicação

Foi adotada a integração Git nativa com **Deployment Checks**, conforme a [orientação oficial da Vercel](https://vercel.com/docs/deployment-checks). Essa escolha permite manter a aprovação dos testes como condição de publicação sem armazenar um token pessoal de deploy no GitHub.

Fluxo de atualização:

1. Um commit é enviado à branch `main`.
2. O GitHub Actions instala, verifica os 81 testes, mede cobertura e gera o build.
3. A Vercel prepara sua versão a partir do mesmo commit.
4. A configuração **Build and Deployment → Deployment Checks** exige o check GitHub **Testes, cobertura e build**, no ambiente Production.
5. A Vercel só atribui o domínio de produção quando esse check é aprovado. Se os testes ou a cobertura falharem, a versão não é promovida ao domínio público.

Os builds podem ocorrer simultaneamente aos testes; a barreira controla a promoção em produção. Não foi usado Force Promote para contornar verificações. A validação da etapa 4 já confirmou que uma cobertura inferior ao limite exigido retorna falha.

Essa configuração de checks pertence ao projeto na Vercel e não é definida no arquivo YAML. Ao reproduzir o projeto em outra conta, conecte o repositório, selecione `main` como branch de produção e importe esse check em Deployment Checks. Mantenha a atribuição automática de domínios de produção ativada.

## Evidências da primeira publicação

- Commit publicado inicialmente: `388a737ba93748a381061ee0eaa459d88eab9914`.
- Deployment: `dpl_2NPJn9WMoHLUp7JpngBSVBVq4eJL`, com estado `READY`.
- A página inicial e `/saude` retornaram HTTP 200 em requisições públicas, sem cookies e sem autenticação.
- A pergunta em branco retornou HTTP 400 com código `PERGUNTA_INVALIDA` e cabeçalho `Cache-Control: no-store`.
- Duas perguntas reais foram respondidas na interface pública: um resumo de texto sobre CI/CD e uma explicação de DevOps sem material de referência.
- O navegador mostrou carregamento e resposta; a consulta ao console após a segunda pergunta não registrou erros.
- A consulta de logs da função, filtrada para erros e falhas fatais na janela da verificação, não retornou registros.
- Os 81 testes automatizados passaram localmente, com cobertura do backend em 100% e do frontend acima de 90% nas quatro métricas.

Os testes automatizados continuam com IA simulada. As duas perguntas de produção utilizaram o provedor real e sua cota.

## Como revisar e apresentar

Abra a URL pública, cole um pequeno texto e use **Resumir este texto**; envie e mostre a resposta. Em seguida, use **Limpar** e faça uma pergunta sem texto. Mostre também `/saude`, o histórico de commits e o workflow aprovado no GitHub.

Para conferir o bloqueio da publicação, abra o projeto na Vercel, acesse **Settings → Build and Deployment → Deployment Checks** e mostre o requisito **Testes, cobertura e build** para Production. No painel de Deployments, confira o commit da versão publicada.

O vídeo, `DECISOES.md`, o roteiro completo e a revisão final da submissão continuam para a etapa 6.
