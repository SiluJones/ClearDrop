# CHANGELOG

> Formato [Keep a Changelog](https://keepachangelog.com/pt-BR/) + [SemVer](https://semver.org/lang/pt-BR/). Entradas novas no topo.

## [0.2.1] — 2026-10-20
> Validada na conta Free: o «asehub» terminou (14 arquivos) com a janela minimizada por um tempo.

### Corrigido
- 0.2.1: com a janela minimizada (ou a aba em segundo plano), a remoção parava com «A lista não terminou de recarregar em 20000 ms» — os tempos de espera agora só contam com a aba visível (FIX-002).
### Adicionado
- Testes 11c/11e (aba oculta) e 11d (arquivo do Projeto com nome começando por «_»): 32 verificações.
- Prints da janela no README (`docs/img/`).

## [0.2.0] — 2026-10-20
> Validada na conta Free: roteiro 5/5.

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
