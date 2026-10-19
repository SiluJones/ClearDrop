# STATUS.md — Estado Atual

> Arquivo **rolante**: só o AGORA. Resolvido sai daqui; médio prazo mora no ROADMAP.

---

## Versão Atual
**0.1.1** — 2026-10-19 — trecho de console funcionando no site real (conta Free, «Canção» esvaziado 6/6). F1 concluída.

## ✅ Funcionando
- `src/cleardrop.js` 0.1.1 (`cfe80aa`):
  - colar no console com a lista de arquivos aberta;
  - `scan()` — ensaio;
  - `run()` — remove após digitar o nome do Projeto;
  - `stop()`.
- `npm test`: 11 OK; a contraprova do FIX-001 reproduz a falha antiga.

## 🔧 Em Progresso
- **F2 — como usar sem colar no console.** Decisões do dono:
  1. Formato: extensão MV3 ou bookmarklet.
  2. Confirmação: clique numa janela que mostra nome e contagem, ou digitar o nome.
  3. Abrir a lista sozinho.
  Ver IDEAS de 19/10.

## ❌ Quebrado / Com Problema
- Nada conhecido.

## 📋 Backlog (curto prazo — itens acionáveis)
- [ ] Dono decide o formato da F2 e o tipo de confirmação.
- [ ] Medir o botão que abre a lista de arquivos no layout limbo (para abrir sozinho).
- [ ] README com o uso do 0.1.1 (prints: a tabela do `scan()` e o aviso final do `run()`).

## 💬 Última conversa
**2026-10-19 (2ª)** — wo0002 aplicada (`cfe80aa`, 11 OK, contraprova ok). Item 4 repetido: «Canção» esvaziado 6/6. O dono perguntou se terá sempre de digitar o nome e de abrir a lista antes. Respondido: hoje sim, e as duas coisas podem mudar na F2. Formato e confirmação ficaram em decisão.
