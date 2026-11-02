# Frontend EstudaIA

Interface em HTML, CSS e JavaScript com Vite, sem framework de componentes. Execute os comandos na raiz do repositório.

```powershell
npm ci
npm run dev:frontend
```

Abra `http://127.0.0.1:5173`. Inicie também o backend em outro terminal com `npm run start:backend`. O proxy do Vite encaminha os endpoints ao backend na porta 3000. A interface não usa nem recebe a chave Gemini.

## Organização

- `index.html`: formulário, rótulos acessíveis e estados da área de resposta.
- `src/styles.css`: identidade visual, duas colunas no desktop, uma coluna em telas menores, foco de teclado e preferência por movimento reduzido.
- `src/main.js`: importa os estilos e inicializa a interface.
- `src/app.js`: eventos do formulário, validação, contadores, resumo, exemplos, estados, cópia e limpeza.
- `src/api.js`: POST JSON na mesma origem, interpretação do contrato da API e timeout de 30 segundos, superior aos 25 segundos do backend.

As respostas usam `textContent` e preservam quebras de linha. Markdown eventualmente gerado pela IA aparece como texto; nenhum HTML recebido é executado. Não há histórico em localStorage nem banco. Durante o envio, os controles ficam bloqueados para impedir chamadas duplicadas. O atalho de resumo apenas preenche a pergunta; o envio é explícito.

## Testes e build

```powershell
npm run test:frontend
npm run test:coverage:frontend
npm run build
```

Os testes Vitest em jsdom usam o mesmo HTML da aplicação e simulam o serviço ou `fetch`, sem consumir IA. O relatório fica em `frontend/coverage/index.html`; o build fica em `frontend/dist`. A cobertura exclui somente o bootstrap `main.js`, verificado no navegador. O mínimo é 70% em cada métrica.

A cópia depende da API de clipboard do navegador, normalmente disponível em HTTPS e localhost. Caso o navegador a bloqueie, a interface orienta a cópia manual. As fontes são carregadas do Google Fonts com fallback para fontes locais.

Veja as [evidências da etapa 3](../docs/ETAPA_3.md). O build da interface isolado não substitui a futura publicação conjunta do frontend e da API.
