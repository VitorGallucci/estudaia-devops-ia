# EstudaIA

[![CI - testes e build](https://github.com/VitorGallucci/estudaia-devops-ia/actions/workflows/ci.yml/badge.svg?branch=main&event=push)](https://github.com/VitorGallucci/estudaia-devops-ia/actions/workflows/ci.yml)

O EstudaIA é um assistente de estudos que usa o Gemini para resumir materiais e responder a perguntas em português. É possível colar um texto de apoio ou fazer uma pergunta direta. O projeto não exige cadastro e não mantém um histórico de conversas.

**Vitor Barbosa Gallucci** · Desafio DevOps e IA · Pós-graduação PUCPR

[Abrir aplicação](https://estudaia-devops-ia.vercel.app/) · [Consultar saúde da API](https://estudaia-devops-ia.vercel.app/saude) · [Ler decisões do projeto](DECISOES.md)

## Arquitetura

- [Frontend](frontend/README.md) — HTML, CSS e JavaScript com Vite. A interface valida o formulário, indica o carregamento e exibe a resposta como texto.
- [Backend](backend/README.md) — Node.js 22 e Express. A API valida os dados e chama o Gemini via `fetch`. A credencial fica no servidor.
- [Adaptador da Vercel](api/README.md) — reutiliza a aplicação Express em produção e serve a API na mesma origem da interface.

## Desenvolvimento local

Use Node.js 22 e npm 10 ou superior. Se o PowerShell bloquear `npm`, use `npm.cmd`.

```powershell
npm ci
```

Crie um `.env` na raiz a partir do [.env.example](.env.example) e configure `GEMINI_API_KEY` para gerar respostas. `GEMINI_MODEL` tem como padrão `gemini-3.5-flash-lite`, e `PORT` tem como padrão `3000`. O arquivo com a chave fica fora do Git. Em produção, a chave é um segredo da Vercel.

Em dois terminais na raiz do projeto, execute um comando em cada:

```powershell
npm run dev:backend
npm run dev:frontend
```

Abra `http://127.0.0.1:5173`. Em desenvolvimento, o Vite encaminha as chamadas ao backend em `127.0.0.1:3000`. Se mudar a porta da API, ajuste o destino em `frontend/vite.config.js`. O comando `npm run build` gera os arquivos estáticos em `frontend/dist`.

## API

| Método e rota | Entrada JSON | Resposta de sucesso |
| --- | --- | --- |
| `GET /saude` | Nenhuma | `{ "status": "ok" }` |
| `POST /perguntar` | `{ "pergunta": "Resuma em tópicos", "texto": "Material de estudo" }` | `{ "resposta": "Resumo gerado" }` |

Envie `Content-Type: application/json` no POST. A pergunta é obrigatória e aceita até 1.000 caracteres. O texto é opcional e aceita até 12.000 caracteres. A rota de saúde funciona sem chave e sem consumir a cota do Gemini.

Os erros seguem o formato `{ "erro": { "codigo": "...", "mensagem": "..." } }`. A API trata entradas inválidas, falhas do provedor, cota esgotada e timeout de 25 segundos. Revise as respostas geradas e evite inserir dados pessoais ou material confidencial.

## Testes e cobertura

```powershell
npm run check:structure
npm test
npm run test:coverage
```

O Vitest executa 55 testes no backend e 26 no frontend. O Supertest cobre as rotas HTTP e o jsdom permite testar o formulário. O Gemini é simulado, então a suíte roda sem chave ou chamadas ao provedor.

A cobertura V8 exige pelo menos 70% em instruções, ramificações, funções e linhas, separadamente no backend e no frontend. Os relatórios HTML são gerados em `backend/coverage/index.html` e `frontend/coverage/index.html`. A medição cobre a lógica da aplicação e exclui os arquivos de inicialização `server.js` e `main.js`.

## CI/CD

O [GitHub Actions](.github/workflows/ci.yml) instala as dependências pelo lockfile, verifica a estrutura, roda os testes com cobertura e gera o build. As execuções disponibilizam os relatórios de cobertura como artefatos. O badge acima mostra o status do workflow para pushes em `main`.

A Vercel publica a interface de `frontend/dist` e encaminha as duas rotas da API para a função Express. Antes de promover um commit de `main` para o domínio de produção, a Vercel exige que o check **Testes, cobertura e build** daquele commit seja aprovado.
