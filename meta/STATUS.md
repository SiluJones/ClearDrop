# STATUS.md — Estado Atual

> Arquivo **rolante**: só o AGORA. Resolvido sai daqui; médio prazo mora no ROADMAP.

---

## Versão Atual
**0.1.1 (não lançada)** — 2026-10-19 — corrige o primeiro uso real (FIX-001); falta repetir o item 4 do roteiro.

## ✅ Funcionando
- `src/cleardrop.js` 0.1.0 versionado (`a9cbfe2`), `npm test` verde na máquina do dono.
- Roteiro na conta Free: itens 1 a 3 ok — carregar, `scan()` e cancelamento por nome errado.

## 🔧 Em Progresso
- **wo0002** (`meta/workorders/261019-wo0002-fix-001-rotulo-com-icone.md`): versionar o 0.1.1 — `visibleLabel()`, fixture do menu medido, caso 1b.

## ❌ Quebrado / Com Problema
- **0.1.0 não remove nada no site real** (FIX-001; corrigido no 0.1.1, ainda não versionado nem testado no site).

## 📋 Backlog (curto prazo — itens acionáveis)
- [ ] Aplicar a wo0002 no Code.
- [ ] Repetir o item 4 do roteiro na conta Free com o 0.1.1 (Projeto «Canção», 6 arquivos).
- [ ] README com o uso, depois do item 4 (prints: a tabela do `scan()` e o aviso final do `run()`).

## 💬 Última conversa
**2026-10-19** — wo0001 aplicada (`a9cbfe2`, 10 OK). No site real, `run()` recusou o item «Remover do projeto» porque o texto traz o glifo `U+E101` do ícone (FIX-001). Corrigido com `visibleLabel()`; teste passou a usar o menu medido; o código antigo reproduz a falha, o novo passa (11 OK).
