# Decisões do EstudaIA

Escolhi fazer um assistente de estudos porque queria trabalhar com um uso simples da IA generativa. Quando tenho um texto longo, um resumo em tópicos ajuda a organizar a primeira leitura. Depois posso fazer uma pergunta específica sobre um trecho. Também deixei o texto de apoio opcional para que o EstudaIA sirva para dúvidas diretas. A resposta é gerada pelo Gemini e precisa ser conferida com o material de estudo.

Usei HTML, CSS e JavaScript com Vite na interface e Node.js com Express na API. Usar JavaScript nos dois lados facilitou acompanhar o caminho da pergunta, do formulário até a resposta exibida na tela. Mantive a aplicação sem cadastro e sem banco de dados porque cada pedido pode ser respondido com os dados enviados naquele momento. Separei a criação da aplicação Express da abertura da porta local para reaproveitar as mesmas rotas nos testes e na Vercel.

Uma dificuldade foi descobrir por que o modelo inicialmente previsto retornava HTTP 404 ao gerar uma resposta, mesmo aparecendo na lista de modelos. A troca para o Gemini 3.5 Flash-Lite foi validada com uma chamada real. Essa diferença entre aparecer na lista e responder a uma solicitação mostrou a importância de testar o fluxo completo. A chave fica no backend, em uma variável de ambiente. O repositório mantém um exemplo com o campo vazio e o Git ignora o arquivo com o valor local.

Com os testes, aprendi a separar a lógica do sistema da dependência externa. Simular a chamada ao Gemini permite verificar como a API reage a sucesso, erro e timeout sem depender da rede ou consumir a cota. Também ficou mais claro para mim o papel da cobertura. Ela ajuda a enxergar quais caminhos os testes exercitam e serve como critério no GitHub Actions. A Vercel usa o resultado desse check antes de promover o commit ao domínio público.

Em uma próxima versão, eu incluiria um limite de requisições para proteger a cota e testes no navegador para cobrir o caminho completo da interface. Usei IA como apoio no desenvolvimento e na revisão do projeto.
