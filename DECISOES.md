# Decisões do projeto EstudaIA

Meu projeto é o EstudaIA, um assistente de estudos que permite resumir um texto e tirar dúvidas. Escolhi esse tema porque representa uma necessidade simples de demonstrar: transformar anotações em uma explicação mais organizada. A IA Generativa participa criando uma resposta a partir da pergunta e, quando disponível, do material enviado. Não se trata de uma lista de respostas prontas, e o resultado precisa ser revisado pelo estudante.

Escolhi HTML, CSS e JavaScript com Vite no frontend para manter a interface e o processo de build compreensíveis. No backend, utilizei Node.js com Express. Trabalhar com JavaScript nos dois lados reduz a quantidade de tecnologias que preciso acompanhar para explicar o fluxo completo. A aplicação tem dois endpoints principais: `GET /saude`, que informa se a API está disponível, e `POST /perguntar`, que valida os dados e solicita uma resposta ao Gemini.

A chave de API fica exclusivamente no backend. O repositório contém um `.env.example` com o campo da chave vazio, enquanto o `.env` local é ignorado pelo Git. Na Vercel, a chave foi configurada como segredo do ambiente de produção. Também separei a criação da aplicação Express da abertura da porta local. Assim, a mesma lógica pode ser usada nos testes e na função da Vercel.

Uma dificuldade técnica concreta foi a disponibilidade do modelo. O Gemini 2.5 Flash-Lite inicialmente previsto retornou HTTP 404 na geração, apesar de aparecer na listagem da conta. Após consultar a documentação e verificar uma chamada real, o projeto passou a usar o Gemini 3.5 Flash-Lite. A escolha ficou explícita na configuração; não há troca automática para um modelo pago.

Para a qualidade, utilizei Vitest, Supertest, jsdom e cobertura V8. As chamadas à IA são simuladas nos testes, permitindo verificar sucesso, erros, limites e timeout sem depender da disponibilidade do provedor ou consumir sua cota. A cobertura mínima é de 70% em cada uma das quatro métricas, separadamente para frontend e backend. Entendo que cobertura indica código exercitado e não garante ausência de defeitos.

O GitHub Actions executa testes, cobertura e build a cada atualização. A Vercel está conectada ao repositório e exige o check de qualidade aprovado antes de promover a versão para o domínio de produção. Esse fluxo permite demonstrar tanto integração contínua quanto publicação contínua. Os commits foram feitos ao longo das etapas, registrando a evolução real do trabalho.

O principal aprendizado que este projeto me permite demonstrar é a ligação entre funcionalidade, segurança, testes e entrega. Como melhoria futura, eu priorizaria limitação de requisições para proteger a cota, observabilidade mais completa e testes automatizados de navegador. Mantive a primeira versão sem cadastro ou banco de dados para concentrar a entrega no fluxo solicitado.

Utilizei IA como assistente de desenvolvimento, conforme permitido na atividade. Minha responsabilidade na apresentação é revisar o código, compreender essas decisões e explicar o que foi entregue, inclusive suas limitações.
