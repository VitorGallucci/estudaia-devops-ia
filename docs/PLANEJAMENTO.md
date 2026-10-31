# Planejamento — EstudaIA

## Objetivo e critérios de aceite

Construir um assistente em português para resumir textos e esclarecer dúvidas, com código original e explicável pelo autor. A entrega exige repositório público com `/backend` e `/frontend`, dois endpoints, IA real em produção, cobertura mínima de 70%, pipeline verde, documentação e vídeo de 5 a 8 minutos.

Repositório público: [VitorGallucci/estudaia-devops-ia](https://github.com/VitorGallucci/estudaia-devops-ia), branch `main`.

## Arquitetura acordada

Frontend HTML/CSS/JavaScript com Vite; backend Node.js com Express; adaptador em `/api` para execução na Vercel, reutilizando o backend testado. Ambos serão acessados pela mesma URL em produção. O servidor de desenvolvimento do frontend encaminhará as rotas de API ao backend local.

O navegador enviará `pergunta` e `texto` ao backend, que validará a entrada, montará a orientação de estudo e chamará o Gemini. A resposta retornará como texto, sem execução de HTML. Não haverá banco, autenticação, upload de arquivos ou armazenamento permanente das conversas.

Modelo inicial: `gemini-2.5-flash-lite`, configurável por ambiente, com chave apenas no backend. Antes da primeira chamada real, conferir disponibilidade do modelo e permanência do projeto no Free Tier. Não ativar faturamento nem fallback pago.

## Comportamento previsto

- Texto opcional de até 12.000 caracteres e pergunta obrigatória de até 1.000.
- Atalho para pedir resumo em tópicos; enviar, copiar resposta e limpar.
- Interface responsiva clara, com detalhes azuis, rótulos acessíveis, indicação de carregamento e erros compreensíveis.
- Bloquear envio duplicado e orientar a revisão das respostas.
- API: `GET /saude` retorna `{ "status": "ok" }`; `POST /perguntar` recebe `{ "pergunta": "...", "texto": "..." }` e retorna `{ "resposta": "..." }`.
- Timeout Gemini de 25 segundos. Tratar entrada inválida, segredo ausente, limite de uso, indisponibilidade e resposta vazia ou bloqueada, sem revelar detalhes internos.

## Etapas e pontos de revisão

1. **Fundação:** documentação, estrutura npm, arquivos de ambiente e segurança. Commits separados para documentação e estrutura.
2. **Backend:** saúde, validação, serviço Gemini e erros; testes com mock acompanham as funcionalidades.
3. **Interface:** formulário e visual; integração; carregamento, erros, cópia e limpeza em commits próprios.
4. **Qualidade e CI:** cobertura e testes completos; workflow GitHub Actions com relatório e badge real.
5. **Produção e CD:** configurar Vercel Hobby e segredos; deploy após testes e build aprovados em `main`; verificar acesso público e duas respostas reais.
6. **Entrega:** README final, decisões, roteiro narrado, guia de estudo e checklist.

Ao concluir cada etapa, informar mudanças, verificações e commits ao autor e aguardar nova mensagem antes de começar a seguinte. Commits refletem trabalho real, sem datas artificiais ou commits vazios. Não alterar projetos anteriores do GitHub.

## Verificação

- Vitest e cobertura V8; Supertest para API e ambiente DOM para frontend.
- Mínimo de 70% em linhas, funções, instruções e ramificações, separadamente no backend e frontend.
- Simular Gemini: sucesso com e sem texto, quota esgotada, timeout, indisponibilidade, resposta vazia e bloqueada.
- Verificar validação, formulário, atalho de resumo, envio duplicado, estados de carregamento e erro.
- GitHub Actions em push e pull request: `npm ci`, testes com cobertura e build; publicar relatório HTML como artefato.
- Deploy apenas em `main` após aprovação das verificações, com segredos restritos ao job de deploy. Impedir deploy paralelo automático que contorne o CI.
- Produção: URL sem login, saúde, resumo e pergunta reais; conferir SHA publicado e badge.

## Entrega e responsabilidades

Meta técnica: 05/11/2026. Reservar 06 e 07/11 para revisão, gravação e submissão até 23h59 de 07/11, horário de Brasília.

O autor fará login quando necessário, revisará `DECISOES.md`, gravará e publicará o vídeo e enviará a submissão pelo portal PUCPR. Os materiais finais não devem afirmar experiências ou resultados que ainda não ocorreram.

O roteiro terá aproximadamente 7 minutos e seguirá os blocos do professor: apresentação, demonstração em produção, código e segurança, testes e pipeline, decisões.
