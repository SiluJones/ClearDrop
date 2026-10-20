# CHANGELOG

> Formato [Keep a Changelog](https://keepachangelog.com/pt-BR/) + [SemVer](https://semver.org/lang/pt-BR/). Entradas novas no topo.

## [Não lançado]
### Adicionado
- 0.2.0: extensão do Chrome (`extension/`). Clique no ícone → a lista abre sozinha → janela com nome, contagem e lista → Cancelar/Remover → progresso com Parar → resultado (DEC-006).
- O núcleo abre a lista de arquivos se estiver fechada e a reabre se fechar no meio.
- `README.md` com instalação e uso.
- Testes: 20 casos, 29 verificações — janela, abrir/reabrir, Projeto vazio, execução dupla, nome com HTML, caractere invisível literal.
### Modificado
- O núcleo mudou de `src/cleardrop.js` para `extension/cleardrop.js`; `run()` aceita `confirm`, `onProgress` e `notify` e devolve um resultado; `scan()` ficou assíncrono.
### Removido
- `src/` (o núcleo vive em `extension/`).

## [0.1.1] — 2026-10-19
> Primeira versão que funciona no site real: esvaziou um Projeto de 6 arquivos na conta Free. O 0.1.0 nunca removeu nada (FIX-001).

### Corrigido
- 0.1.1: o item «Remover do projeto» era recusado por causa do glifo do ícone (`U+E101`) no texto do menu; rótulos agora são lidos sem o que é `aria-hidden` — FIX-001.
- Testes montam o menu a partir do outerHTML medido (`tests/fixtures/menu-limbo.html`) e cobrem o glifo (caso 1b).
### Adicionado
- `src/cleardrop.js` 0.1.0: `scan()` (ensaio), `run()` (remoção com confirmação digitada, paradas de segurança, retomada) e `stop()`; recusa no layout com «Selecionar».
- `tests/cleardrop.test.js` + fixture do modal real; `npm test` com jsdom (DEC-005).
- Documentação de contexto preenchida (CONTEXT, SPEC, STATUS, DECISIONS DEC-001..003, IDEAS, ROADMAP, GLOSSARY, HISTORY) e log de 2026-10-17.
- Mapeamento do modal «Arquivos» a partir do outerHTML real (CONTEXT, seção crítica).
- Análise `meta/analises/261017-ANALISE-forma-e-seletores.md` e o modelo `_TEMPLATE.md`: menu ⋮ medido, exclusão em lote nativa redescoberta, seletores tabelados.
- DEC-004: escopo restrito ao layout «limbo», em trecho de console; DEC-002 superada.
### Modificado
- Placeholders do kit trocados por ClearDrop (README, Instruções, CLAUDE.md); `.gitignore` passa a ignorar HAR, `.env` e zips.
