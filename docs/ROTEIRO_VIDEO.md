# Roteiro completo — EstudaIA

**Meta: 7 minutos e 40 segundos. Limite da atividade: 5 a 8 minutos.** Gravação de tela com sua narração; câmera opcional; arquivo MP4. As falas abaixo são sugestões: ensaie e adapte para suas palavras. As respostas da IA variam, então comente o que aparecer de verdade.

## Antes de gravar

1. Leia `DECISOES.md` e o `GUIA_DE_ESTUDO.md`. Ajuste as reflexões para corresponder ao seu entendimento.
2. Abra a aplicação e confira se responde. Faça a gravação com perguntas reais; não use uma imagem ou resposta previamente inserida como se fosse uma chamada ao vivo.
3. Deixe as abas da tabela abaixo prontas. Na aplicação, use **Limpar** antes de iniciar.
4. Abra um PowerShell na pasta do projeto. Os testes não precisam dos servidores locais ou da chave.
5. Faça uma gravação curta para conferir microfone, volume e legibilidade do código. Evite capturar notificações.
6. Mostre apenas `.env.example`, que tem a chave vazia. Mantenha o `.env` real e os valores de segredo da Vercel fechados.
7. Não precisa fazer um novo deploy, editar código, criar commits ou usar localhost durante a demonstração. A demonstração da aplicação será na URL pública; somente os testes serão executados localmente.

Comando para posicionar o terminal:

```powershell
Set-Location -LiteralPath 'C:\Users\Micro\Desktop\Desafio na DevOps e IA'
```

As dependências já estão instaladas nesta máquina. Em outra máquina ou instalação limpa, use `npm.cmd ci` antes da gravação. Durante a gravação, execute os testes de verdade com `npm.cmd run test:coverage`.

## Abas e links, na ordem da gravação

| Uso | Acesso |
| --- | --- |
| Aplicação em produção | https://estudaia-devops-ia.vercel.app |
| Saúde da API | https://estudaia-devops-ia.vercel.app/saude |
| Repositório público, pastas e badge | https://github.com/VitorGallucci/estudaia-devops-ia |
| Rotas da API | https://github.com/VitorGallucci/estudaia-devops-ia/blob/main/backend/src/app.js#L16 |
| Chamada real ao Gemini | https://github.com/VitorGallucci/estudaia-devops-ia/blob/main/backend/src/gemini.js#L14 |
| Exemplo vazio das variáveis | https://github.com/VitorGallucci/estudaia-devops-ia/blob/main/.env.example |
| Regras para ignorar segredos | https://github.com/VitorGallucci/estudaia-devops-ia/blob/main/.gitignore |
| Histórico de commits | https://github.com/VitorGallucci/estudaia-devops-ia/commits/main/ |
| Mock do Gemini | https://github.com/VitorGallucci/estudaia-devops-ia/blob/main/backend/tests/gemini.test.js#L24 |
| Limite de cobertura do backend | https://github.com/VitorGallucci/estudaia-devops-ia/blob/main/backend/vitest.config.js#L13 |
| Limite de cobertura do frontend | https://github.com/VitorGallucci/estudaia-devops-ia/blob/main/frontend/vitest.config.js#L14 |
| Workflow e execuções | https://github.com/VitorGallucci/estudaia-devops-ia/actions/workflows/ci.yml |
| Arquivo do workflow | https://github.com/VitorGallucci/estudaia-devops-ia/blob/main/.github/workflows/ci.yml |
| Exemplo de execução aprovada com 81 testes | https://github.com/VitorGallucci/estudaia-devops-ia/actions/runs/41734745497 |
| Check obrigatório na Vercel — exige sua sessão | https://vercel.com/vitorgalluccis-projects/estudaia-devops-ia/settings/build-and-deployment#deployment-checks |
| Decisões | https://github.com/VitorGallucci/estudaia-devops-ia/blob/main/DECISOES.md |

Não é necessário deixar 16 abas abertas: agrupe as páginas do GitHub e navegue pelos links já preparados. O check da Vercel e as configurações de cobertura são apoio; priorize os itens obrigatórios indicados nos blocos seguintes.

## 0:00–0:45 — Apresentação

**Mostre:** página inicial da aplicação, com a URL pública visível. Pode manter a câmera desligada.

**Fala sugerida:**

> Olá, meu nome é Vitor Gallucci e este é o EstudaIA, meu projeto para a disciplina Desafio DevOps e IA da pós-graduação PUCPR. O problema que escolhi trabalhar é a organização do estudo: às vezes temos um texto grande ou uma dúvida e precisamos de uma explicação mais clara. A aplicação permite resumir um material e fazer perguntas. Ela usa IA Generativa porque o Gemini produz uma resposta em linguagem natural a partir da pergunta e do contexto, em vez de consultar apenas respostas prontas. Vou mostrar a aplicação publicada, o código, os testes e a automação da entrega.

## 0:45–3:00 — Duas perguntas reais em produção

**0:45–1:15 — Apresente o formulário e cole o material.**

Texto para copiar antes de começar:

```text
A integração contínua executa testes automatizados a cada alteração no código. A entrega contínua mantém o sistema pronto para publicação após a aprovação desses testes. A automação ajuda a detectar problemas cedo e a tornar as entregas mais repetíveis.
```

**Fala:**

> Esta é a URL pública da aplicação na Vercel. Não estou usando localhost para a demonstração. O material é opcional, e a pergunta é obrigatória. Vou usar um pequeno texto sobre integração e entrega contínuas. Os campos possuem limites e contadores para orientar o preenchimento.

**1:15–2:00 — Primeira pergunta.** Clique em **Resumir este texto** e depois em **Enviar pergunta**. Deixe o carregamento e a resposta aparecerem.

> O atalho preenche um pedido de resumo em tópicos. O envio acontece quando clico neste botão. Durante a chamada, os controles ficam bloqueados para evitar solicitações duplicadas. A resposta que apareceu foi gerada pelo Gemini a partir do texto enviado.

Comente uma ideia realmente presente na resposta. Por exemplo, se ela distinguir os conceitos:

> Aqui ele separou os testes feitos na integração contínua da preparação para publicação na entrega contínua.

Não leia toda a resposta. Se estiver dentro do tempo, clique em **Copiar resposta** e mostre a confirmação.

**2:00–2:40 — Segunda pergunta.** Clique em **Limpar** e digite no campo de pergunta, sem material:

```text
Explique o que é DevOps com um exemplo simples em até três frases.
```

Clique em **Enviar pergunta**, aguarde e mostre a nova resposta.

> Agora estou fazendo uma pergunta sem fornecer texto de apoio. Nesse caso, a aplicação funciona como um tutor para dúvidas de estudo. A resposta não é fixa e precisa ser revisada; por isso há um aviso na interface para comparar o resultado com o material de estudo.

**2:40–3:00 — Saúde da API.** Abra a aba de `/saude`.

> Este é o segundo endpoint da aplicação. Ele devolve status ok para indicar que a API está disponível, sem consumir uma chamada de IA. As perguntas usam POST; esta consulta de saúde usa GET.

## 3:00–4:30 — Código, segurança e histórico

**Mostre nesta ordem:** repositório com indicação Public e pastas, rotas, serviço Gemini, `.env.example`, `.gitignore` e commits.

**3:00–3:20 — Estrutura e rotas.**

> O repositório é público e está organizado em frontend e backend. A interface usa HTML, CSS e JavaScript com Vite, e a API usa Node.js com Express. Aqui estão os endpoints de saúde e perguntas. O endpoint de perguntas valida a entrada e chama o serviço de IA, devolvendo a resposta em JSON.

**3:20–3:55 — Abra `gemini.js`, mostrando `process.env`, `fetchImpl` e o corpo enviado.**

> Neste arquivo está a chamada ao Gemini. A chave vem de uma variável de ambiente e é usada no cabeçalho da requisição, somente no backend. A pergunta e o texto são enviados separados da instrução que orienta o assistente a responder em português. Também há timeout e tratamento para falhas, limite de uso e resposta vazia.

**3:55–4:15 — Mostre o exemplo vazio e o ignore.**

> O `.env.example` documenta o que precisa ser configurado, mas tem o campo da chave vazio. O `.gitignore` exclui o `.env` real do versionamento. Na produção, a credencial foi cadastrada como segredo na Vercel; ela não faz parte do frontend.

**4:15–4:30 — Mostre o histórico.**

> Estes commits mostram a evolução por etapas: estrutura, API, integração com IA, interface, testes, pipeline e publicação. As alterações foram registradas durante o desenvolvimento.

## 4:30–6:30 — Testes, cobertura e CI/CD

**4:30–5:15 — Execute os testes no PowerShell.**

```powershell
npm.cmd run test:coverage
```

> Vou executar os testes automatizados. O comando roda backend e frontend, com o Gemini simulado. Atualmente são 55 testes no backend e 26 no frontend, totalizando 81. O mínimo exigido é 70% de cobertura, e a configuração aplica esse limite separadamente às duas partes.

Ao concluir, mostre os resultados e as tabelas. O backend aparece antes do frontend; role o terminal para mostrar ambos.

> O backend atingiu 100% nas quatro métricas. No frontend, linhas e funções ficaram em 100%, instruções em 96,82% e ramificações em 90,47%. A medição é da lógica JavaScript; os arquivos pequenos de inicialização foram verificados separadamente. Cobertura alta não garante que não existam defeitos.

**5:15–5:40 — Mostre o mock em `backend/tests/gemini.test.js`.**

> Aqui uma função simulada substitui o fetch que chamaria o provedor. Assim consigo definir respostas de sucesso e falha e testar o comportamento sem depender da rede, da disponibilidade do Gemini ou da cota da conta. Em produção a aplicação faz a chamada real, como mostrei no início.

**5:40–6:10 — Clique no badge do README, abra execução verde e a etapa dos testes.**

> O GitHub Actions repete essas verificações automaticamente a cada atualização configurada. Ele instala as dependências pelo lockfile, executa os testes e a cobertura e compila a interface. O badge verde está ligado ao resultado real da execução. Os relatórios completos também ficam disponíveis como artefatos para download.

**6:10–6:30 — Explique CD; se a navegação estiver pronta, mostre o check na Vercel.**

> A Vercel está conectada ao repositório e exige a aprovação deste check para promover o mesmo commit ao domínio de produção. Assim, os testes ficam no GitHub Actions e a publicação é controlada pela Vercel. Uma falha nos testes ou na cobertura impede a promoção daquela versão.

## 6:30–7:40 — Decisões e encerramento

**Mostre:** `DECISOES.md` no GitHub. Não leia o arquivo inteiro.

**Fala sugerida, após revisar se representa seu entendimento:**

> Registrei as decisões neste arquivo. Escolhi JavaScript nas duas partes para manter a solução simples de acompanhar e explicar. Usei Express para a API e Vite para gerar a interface, sem adicionar banco de dados ou cadastro a uma funcionalidade que não precisava deles.
>
> Uma dificuldade técnica foi a disponibilidade do modelo inicialmente planejado, que retornou erro na geração. Depois da consulta à documentação e de uma verificação real, o projeto passou a usar o Gemini 3.5 Flash-Lite, configurado explicitamente.
>
> O principal aprendizado que consigo demonstrar é a ligação entre a funcionalidade e sua entrega: proteger configurações, testar sem depender da IA e publicar somente após a qualidade ser aprovada. Em uma próxima versão, eu priorizaria limite de requisições para proteger a cota, observabilidade mais completa e testes automatizados no navegador.
>
> Usei IA como assistente de desenvolvimento, conforme permitido na atividade. O repositório, a aplicação publicada e este vídeo compõem a entrega. Obrigado.

Encerre antes de 8:00. Se o ensaio ficar longo, reduza a leitura das respostas e as transições; mantenha as duas perguntas reais, o mock, a cobertura, o pipeline, a segurança e as decisões.

## Se algo falhar na gravação

- **Quota ou erro do Gemini:** pare e tente novamente quando o serviço permitir. Não apresente uma resposta simulada como resultado real. A aplicação mostra o erro para o usuário.
- **Testes não executam no PowerShell:** use `npm.cmd`, conforme o comando acima. Confira a pasta antes de iniciar.
- **Pipeline em andamento:** espere a conclusão antes de gravar a parte do badge. Abra uma execução realmente aprovada.
- **Relatório ocupa o terminal inteiro:** maximize o terminal, ajuste o tamanho da fonte antes da gravação e role para as duas tabelas.
- **Não consegue terminar em oito minutos:** ensaie com cronômetro; o objetivo é mostrar o fluxo e explicar decisões, não ler todos os arquivos.

## Depois de gravar e o que entregar

1. Confira a duração entre 5 e 8 minutos e o áudio. Guarde o arquivo MP4.
2. Publique pelo [YouTube Studio](https://studio.youtube.com) como **Não listado**, ou envie ao [Google Drive](https://drive.google.com) com **Qualquer pessoa com o link → Leitor**. Consulte as [orientações oficiais de visibilidade do YouTube](https://support.google.com/youtube/answer/157177?hl=pt-BR) ou de [compartilhamento do Drive](https://support.google.com/drive/answer/7166529?hl=pt-BR).
3. Abra o link do vídeo em janela sem login e confira a reprodução.
4. Acrescente o link do vídeo ao checklist e ao texto de submissão. O vídeo ainda não foi gravado ou publicado por este projeto.
5. No portal PUCPR, faça **uma única submissão até 07/11/2026 às 23h59, horário de Brasília**, contendo os links do repositório público, aplicação e vídeo. `DECISOES.md` e badge já ficam no repositório; inclua o link direto das decisões para facilitar a correção. Se o portal apresentar campos adicionais, preencha conforme a atividade.

Use `docs/ENTREGA.md` e `docs/TEXTO_SUBMISSAO.md` como conferência final. A gravação e o envio ao portal ficam sob responsabilidade do autor.
