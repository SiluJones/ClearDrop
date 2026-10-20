# ROADMAP.md — Plano de Evolução

> Fases com objetivo e critério de conclusão. 🟢 concluída · 🟡 em curso/próxima · 🔵 futura · 🚫 descartada.

---

## 🟢 F0 — Medição *(concluída 2026-10-18)*
**Objetivo:** saber como o modal, o menu ⋮ e a confirmação são feitos, antes de escrever qualquer seletor.
**Critério de conclusão:** análise `meta/analises/` escrita com as três medições e a forma confirmada.
- [x] outerHTML do modal «Arquivos» (`261017-0707.html`).
- [x] Menu ⋮ aberto + virtualização com 174 arquivos (trecho 1 do guia).
- [ ] Caixa de confirmação — não capturada; passa para a F1 (observador).
- [x] Análise da forma e dos seletores (`meta/analises/261017-ANALISE-forma-e-seletores.md`) — recomenda encerrar se a conta Free tiver «Selecionar».
- [x] Conta gratuita conferida: sem «Selecionar» → DEC-004.

## 🟢 F1 — Trecho de console para o layout «limbo» (forma A) *(concluída 2026-10-19, 0.1.1)*
**Objetivo:** esvaziar um Projeto em layout «limbo» colando um trecho no console; em layout com «Selecionar», recusar e apontar o nativo.
**Critério de conclusão:** todos os critérios da SPEC passam num Projeto descartável, incluindo uma parada provocada no meio e a retomada.
- [x] Observar uma remoção: sem confirmação, linha some em ~1,3 s, recarga com spinner.
- [x] `src/cleardrop.js` + testes jsdom (8/8) — wo0001.
- [x] Roteiro manual na conta Free (19/10): ensaio e cancelamento ok; esvaziar falhou no 0.1.0 (FIX-001); com o 0.1.1, «Canção» esvaziado 6/6.
- Não exercitado no site real: parada no meio e retomada (cobertas só pelos testes 8a/8b).

## 🟢 F2 — Extensão MV3 *(concluída 2026-10-20, 0.2.0 — DEC-006)*
**Objetivo:** esvaziar o Projeto aberto com um clique no ícone, confirmando numa janela que mostra nome, contagem e lista, sem abrir a lista antes.
**Critério de conclusão:** na conta Free, com a lista fechada, ícone → janela → Remover esvazia um Projeto descartável; Cancelar não remove nada; Parar interrompe e o próximo clique continua.
- [x] Medir o botão que abre a lista: «Mostrar arquivos», `data-quiet-row="context"` (19/10).
- [x] Núcleo com confirmação e progresso injetáveis + abrir e reabrir a lista; testes (20/10).
- [x] `extension/` (manifest, service worker, janela em Shadow DOM); testes da janela — 29 OK (20/10, wo0004).
- [x] Roteiro manual na conta Free (20/10): fora de Projeto mostra «!»; entrando pela barra lateral abre a lista sozinho; Cancelar, Parar e continuar, «Pronto» — 5/5.
- Achado no uso: com a janela minimizada, parou em 19/33 por estouro de tempo — FIX-002 na 0.2.1 (a validar).

## 🔵 F3 — Robustez
**Objetivo:** sobreviver à próxima mudança de layout ou falhar alto.
- Autodiagnóstico de seletores; estudo da forma D (só observação).

## 🔵 F4 — Publicação *(sem data)*
- Leitura dos termos de uso; README com prints; talvez loja.

---

## 🚫 Itens descartados desta visão
- **Formas C, E e F como produto** — ver IDEAS, «Descartadas».
