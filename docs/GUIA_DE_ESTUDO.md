# Guia de estudo — como explicar o EstudaIA

Use este guia para entender o projeto antes de gravar. Leia também `DECISOES.md` e ajuste as reflexões em primeira pessoa para representar o que você compreendeu e considera importante.

## O caminho de uma pergunta

1. A pessoa digita uma pergunta no navegador e pode acrescentar um texto.
2. `frontend/src/app.js` valida o formulário, bloqueia envios duplicados e mostra carregamento.
3. `frontend/src/api.js` faz `POST /perguntar`, enviando JSON para a mesma origem do site.
4. Na Vercel, `vercel.json` encaminha a rota para `api/index.js`, que exporta a aplicação Express.
5. `backend/src/app.js` recebe a requisição, chama a validação e o serviço de IA.
6. `backend/src/gemini.js` envia ao Google a instrução de sistema e os campos de estudo, usando a chave do ambiente.
7. O backend devolve `{ "resposta": "..." }`. A interface mostra o resultado com `textContent`, sem executar HTML recebido.

## Arquivos para reconhecer

| Arquivo | O que explicar |
| --- | --- |
| `frontend/index.html` | Estrutura, rótulos e campos da página. |
| `frontend/src/styles.css` | Visual responsivo, foco de teclado e adaptação para celular. |
| `frontend/src/app.js` | Estados de carregamento, erro, resposta, copiar e limpar. |
| `frontend/src/api.js` | Comunicação HTTP entre navegador e backend. |
| `backend/src/app.js` | Rotas Express e respostas de erro em JSON. |
| `backend/src/validation.js` | Pergunta obrigatória até 1.000 caracteres e texto opcional até 12.000. |
| `backend/src/gemini.js` | Integração real com Gemini, chave no cabeçalho e timeout. |
| `backend/src/server.js` | Abre uma porta somente para desenvolvimento local. |
| `api/index.js` | Exporta o backend para a função da Vercel, sem `listen`. |
| `backend/tests/gemini.test.js` | Simula o provedor com `vi.fn()` e `mockResolvedValue`. |
| `frontend/tests/app.test.js` | Verifica o formulário em ambiente DOM simulado. |
| `.github/workflows/ci.yml` | Instalação, testes, cobertura, build e artefatos no GitHub. |
| `.env.example` e `.gitignore` | Documentação das variáveis e exclusão dos segredos. |

## Perguntas prováveis e respostas curtas

**O que torna a aplicação uma solução com IA Generativa?**

Ela envia uma pergunta e um contexto ao Gemini, que gera uma resposta em linguagem natural. O texto não vem de uma tabela de respostas fixas. O modelo pode variar a resposta e cometer erros, por isso a interface orienta a revisão.

**Onde ficam os dois endpoints?**

Em `backend/src/app.js`. `GET /saude` devolve `{ "status": "ok" }` sem chamar Gemini. `POST /perguntar` valida o corpo e solicita a resposta ao serviço de IA. Abrir `/perguntar` na barra de endereço faz GET, portanto não demonstra o POST; o formulário da aplicação faz essa chamada.

**Por que separar frontend e backend?**

O frontend cuida da interação. O backend valida os dados e protege a chave. O navegador não precisa conhecer a credencial do Google.

**O que é uma API? E JSON?**

API é a interface pela qual componentes se comunicam. Neste projeto, o navegador faz requisições HTTP ao backend. JSON é o formato do corpo dessas mensagens, como `{ "pergunta": "O que é CI?", "texto": "" }`.

**O que é um mock?**

É uma substituição controlada de uma dependência durante o teste. Neste caso, `fetchImpl` pode receber uma função simulada que devolve uma resposta definida no teste, sem acessar o Google. Não é uma resposta falsa na aplicação em produção: a aplicação publicada usa o provedor real.

**O que Supertest, Vitest e jsdom fazem?**

Vitest executa os testes e oferece as verificações e funções simuladas. Supertest verifica a API Express por HTTP. jsdom oferece um DOM simulado para testar a interação do frontend sem depender de um navegador gráfico.

**O que significa 70% de cobertura?**

É o mínimo de código exercitado exigido pela configuração de testes. O projeto mede linhas, instruções, funções e ramificações, com limite de 70% em cada métrica para cada aplicação. Backend e frontend são avaliados separadamente.

**Quais são os resultados atuais?**

81 testes: 55 no backend e 26 no frontend. Backend: 100% nas quatro métricas. Frontend: 100% em linhas e funções, 96,82% em instruções e 90,47% em ramificações. Os relatórios descrevem a lógica JavaScript; os pequenos arquivos de inicialização foram verificados separadamente. Cobertura alta não é prova de ausência de bugs.

**O que é CI?**

Integração contínua: a cada push ou pull request configurado, o GitHub Actions instala as dependências, verifica a estrutura, executa os testes e a cobertura e compila a interface.

**O que é CD neste projeto?**

A Vercel recebe a atualização pela integração Git e prepara uma versão. O domínio de produção só é atualizado quando o check `Testes, cobertura e build` daquele commit é aprovado. A configuração está em Deployment Checks na Vercel. O YAML executa a qualidade; a Vercel cuida da publicação.

**O que o badge verde comprova?**

Que a última execução considerada pelo badge, em push na branch `main`, terminou com sucesso. Ele não comprova sozinho que o Google está disponível ou que toda pergunta terá resposta.

**Como a chave é protegida?**

Ela está no ambiente de produção da Vercel e no `.env` local ignorado. `.env.example` tem o campo vazio. Não é colocada no frontend, na URL da chamada ao Google ou nos testes. Durante a gravação, mostre apenas o exemplo vazio, nunca o `.env` real ou o valor no painel.

**E se a IA falhar?**

O backend converte as falhas em códigos e mensagens públicas. Há tratamento para limite de uso (429), configuração indisponível (503), falha externa (502), conteúdo bloqueado (422) e timeout (504), entre outros. O timeout do Gemini é 25 segundos, o cliente espera até 30 segundos e a função da Vercel permite até 60 segundos.

**A IA tem acesso ao computador ou à internet?**

Esta aplicação não fornece ferramentas ou busca ao modelo. Ela recebe a instrução de sistema, a pergunta e o texto enviado. O backend possui a chave para autenticar a chamada, mas não a insere no conteúdo do prompt.

**Os textos ficam guardados?**

A aplicação não possui banco nem histórico persistente. O conteúdo é enviado ao Gemini para processamento, e sua utilização pelo provedor segue as condições da conta. Não prometa que nada é processado ou retido por terceiros.

**Qual foi a dificuldade técnica mais concreta?**

O modelo inicialmente planejado retornou 404 na geração. A documentação e uma chamada real orientaram a atualização explícita para `gemini-3.5-flash-lite`. A causa exata da restrição da conta não foi comprovada apenas pelo erro.

**O que faria em uma próxima versão?**

Limitação de requisições para proteger a cota, observabilidade mais completa e testes de navegador automatizados. O projeto atual não possui rate limiter ou login; não apresente essas melhorias como funcionalidades prontas.

## Termos para falar com segurança

- **Commit:** registro de uma alteração no histórico Git.
- **Push:** envio dos commits locais ao GitHub.
- **Workflow:** arquivo que define a automação no GitHub Actions.
- **Build:** geração dos arquivos de produção da interface.
- **Deploy:** disponibilização de uma versão na hospedagem.
- **Variável de ambiente:** configuração fornecida ao processo sem colocá-la no código.
- **Serverless:** a plataforma executa a função quando recebe requisições; o projeto não administra uma máquina própria.

## O que revisar pessoalmente

Explique o caminho da pergunta sem ler, localize a chamada ao Gemini, execute os testes e reconheça o mock. Leia `DECISOES.md` e revise qualquer frase que não represente seu entendimento. Você pode usar o roteiro como apoio, mantendo a narração com suas palavras.
