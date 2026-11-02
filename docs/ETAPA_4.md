# Etapa 4 — CI, cobertura e badge

Verificada em **02/11/2026**. A integração contínua foi implementada no GitHub Actions; o deploy de produção permanece para a etapa 5.

## Execução real

A [primeira execução aprovada](https://github.com/VitorGallucci/estudaia-devops-ia/actions/runs/41485115638) corresponde ao commit `4c78633d5107717c3ba947f6b5acf8332c47faed`. Os logs confirmaram 53 testes do backend e 26 do frontend aprovados, build concluído e três artefatos publicados. O job terminou com conclusão `success`.

| Aplicação | Testes | Linhas | Funções | Instruções | Ramificações |
| --- | --- | --- | --- | --- | --- |
| Backend | 53 | 100% | 100% | 100% | 100% |
| Frontend | 26 | 100% | 100% | 96,82% | 90,47% |

A cobertura é da lógica JavaScript, conforme as exclusões já documentadas: inicialização do servidor e bootstrap da interface foram verificados separadamente. Os limites continuam em 70% para cada métrica de cada workspace, sem compensar uma aplicação com a cobertura da outra.

## Como o workflow funciona

Arquivo: `.github/workflows/ci.yml`. Nome: **CI - testes e build**. Job: `quality` (**Testes, cobertura e build**).

1. Inicia em pushes, pull requests com destino a `main` ou acionamento manual pela aba Actions.
2. Obtém o código e configura Node.js pela versão 22 declarada no `.nvmrc`, em Ubuntu 24.04.
3. Usa cache npm baseado no lockfile, instala com `npm ci` e verifica a estrutura do projeto.
4. Executa `npm run test:coverage` nos dois workspaces. Testes falhos ou cobertura abaixo do mínimo retornam erro.
5. Executa `npm run build` somente após os passos anteriores terem sucesso.
6. Envia relatórios e build como artefatos, retidos por 14 dias. Os relatórios disponíveis também são enviados se a etapa de testes falhar; isso não transforma a execução em sucesso.

O job tem limite de 10 minutos. Uma execução nova na mesma referência cancela a anterior ainda em andamento. As actions oficiais foram fixadas por SHA, e `contents: read` limita o token do workflow. Não há chave Gemini, `.env` ou segredos de deploy no CI. Os testes simulam a IA e não consomem cota.

## Verificação da barreira de cobertura

Foi feita uma verificação local sem alterar arquivos: exigir temporariamente 100% de ramificações no frontend fez o Vitest retornar código 1 com a mensagem de que os 90,47% obtidos não atingiam o limite de 100%. Isso confirmou que a cobertura é uma condição de aprovação, não apenas um relatório.

Comando dessa verificação intencional de falha:

```powershell
npm run test:coverage --workspace frontend -- --coverage.thresholds.branches=100
```

O comando normal, com os limites versionados de 70%, continua sendo `npm run test:coverage`.

## Como mostrar no vídeo

1. Abra o README público e mostre o badge verde. Clique nele.
2. Abra uma execução aprovada e o job **Testes, cobertura e build**.
3. Expanda a etapa de testes e mostre a quantidade de testes e as tabelas de cobertura.
4. Explique que a IA foi simulada para manter testes rápidos, repetíveis e sem consumo de cota.
5. Volte ao resumo da execução e mostre os artefatos `cobertura-backend`, `cobertura-frontend` e `build-frontend`.
6. Para demonstrar localmente, execute `npm run test:coverage` e abra os relatórios HTML gerados.

O badge usa o status real do workflow em pushes na branch `main`; pode aparecer como `passing`, `failing` ou em execução. Ele não é uma imagem verde fixa. O build armazenado é o frontend estático, e não uma URL pública nem um deploy completo.

## Próxima etapa

A etapa 5 vai configurar Vercel, adaptador da API e publicação contínua dependente do job `quality`. Esta etapa não cria deploy, não ativa cobrança e não altera permissões da conta.
