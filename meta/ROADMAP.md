# ROADMAP.md — Plano de Evolução

> Fases com objetivo e critério de conclusão. 🟢 concluída · 🟡 em curso/próxima · 🔵 futura · 🚫 descartada.

---

## 🟡 F0 — Medição *(em curso)*
**Objetivo:** saber como o modal, o menu ⋮ e a confirmação são feitos, antes de escrever qualquer seletor.
**Critério de conclusão:** análise `meta/analises/` escrita com as três medições e a forma confirmada.
- [x] outerHTML do modal «Arquivos» (`261017-0707.html`).
- [x] Menu ⋮ aberto + virtualização com 174 arquivos (trecho 1 do guia).
- [ ] Caixa de confirmação — não capturada; perdeu prioridade com o recurso nativo.
- [x] Análise da forma e dos seletores (`meta/analises/261017-ANALISE-forma-e-seletores.md`) — recomenda encerrar se a conta Free tiver «Selecionar».
- [ ] Conferir a conta gratuita (ponto de decisão).

## 🔵 F1 — Prova no console (forma A)
**Objetivo:** esvaziar um Projeto descartável colando um trecho no console.
**Critério de conclusão:** todos os critérios da SPEC passam num Projeto descartável, incluindo uma parada provocada no meio e a retomada.
- Modo ensaio → excluir 1 cobaia → esvaziar o Projeto inteiro.

## 🔵 F2 — Extensão MV3 (forma B)
**Objetivo:** o mesmo núcleo como extensão carregada sem compactação, com um botão.
**Critério de conclusão:** o dono esvazia um Projeto real com um clique + confirmação.

## 🔵 F3 — Robustez
**Objetivo:** sobreviver à próxima mudança de layout ou falhar alto.
- Autodiagnóstico de seletores; estudo da forma D (só observação).

## 🔵 F4 — Publicação *(sem data)*
- Leitura dos termos de uso; README com prints; talvez loja.

---

## 🚫 Itens descartados desta visão
- **Formas C, E e F como produto** — ver IDEAS, «Descartadas».
