# STATUS.md — Estado Atual

> Arquivo **rolante**: só o AGORA. Resolvido sai daqui; médio prazo mora no ROADMAP.

---

## Versão Atual
**0.2.0 (não lançada)** — 2026-10-20 — extensão escrita e testada em jsdom (29 OK); falta o roteiro na conta Free.

## ✅ Funcionando
- 0.1.1 pelo Console no site real (`cfe80aa`).
- 0.2.0 no ambiente do chat:
  - `extension/` com manifest, service worker, núcleo e janela;
  - `npm test` 29 OK;
  - mutações conferidas (sem a guarda do clique fora → 15a cai; sem reabrir → 11b cai; sem abrir → 9, 10, 11, 14 caem).

## 🔧 Em Progresso
- **wo0004** (`meta/workorders/261020-wo0004-f2-extensao.md`): versionar a extensão, remover `src/`, apontar o `CLAUDE.md` para `extension/`, `npm test`.

## ❌ Quebrado / Com Problema
- Nada conhecido.
- **Não verificado no site:** se o «clique fora» realmente fecha a lista do site. A guarda e a reabertura cobrem os dois casos.

## 📋 Backlog (curto prazo — itens acionáveis)
- [ ] Aplicar a wo0004 no Code.
- [ ] Instalar a extensão na conta Free e rodar o roteiro (Cancelar, Remover, Parar e continuar).
- [ ] Prints para o README: a janela de confirmação e a tela «Pronto».

## 💬 Última conversa
**2026-10-20** — Medição: «Mostrar arquivos» (`data-quiet-row="context"`) abre a lista. Escritos `extension/` (DEC-006 ajustada: `claude.ai/*` por causa da navegação sem recarga; núcleo dentro de `extension/` por causa dos `_TEMPLATE.md`), testes 29 OK e README com a instalação. Achado: escapes `\uXXXX` no texto de comando viram o caractere invisível; virou técnica no CEREBRO e o caso 20 do teste.
