# ClearDrop — projeto de contexto (Desenvolvimento)

Estrutura de arranque gerada pelo Kit de Contexto Universal v1.126.0.
Data: 2026-10-17

## Estrutura
- `meta/` — arquivos de contexto (CEREBRO define COMO o assistente age; CONTEXT, O QUE o projeto e; STATUS/DECISIONS/IDEAS...).
- `INSTRUCOES-DO-PROJETO.md` — cole em Projeto -> Instrucoes no claude.ai (versao curta, lida em toda mensagem).
- `logs/` — um arquivo por sessao (vazia por enquanto).
- `meta/analises/` — uma analise por decisao nao-trivial (problema, o que foi medido, opcoes, recomendacao, riscos, ponto de decisao). NAO vem no pacote: a pasta nasce quando a primeira analise for escrita.
- `CLAUDE.md` + `.claude/` — arranque do Claude Code (settings + skills apply-wo/wrap). Ajuste o comando de build no CLAUDE.md e no allow do settings.
- `meta/workorders/` — WOs: instrucoes de aplicacao do chat para o Code (vazia por enquanto).
- `.gitignore` / `.flatdropignore` — o segundo enxuga o que sobe ao Projeto do Claude sem tirar o versionamento.

## Como comecar
1. Suba os `meta/` (e o `INSTRUCOES-DO-PROJETO.md`) a um Projeto do claude.ai — ou use o FlatDrop para achatar e subir de uma vez.
2. Cole o `INSTRUCOES-DO-PROJETO.md` em Projeto -> Instrucoes.
3. Para desenvolver no Claude Code: abra a pasta; o CLAUDE.md guia o resto.
