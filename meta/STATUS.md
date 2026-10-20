# STATUS.md — Estado Atual

> Arquivo **rolante**: só o AGORA. Resolvido sai daqui; médio prazo mora no ROADMAP.

---

## Versão Atual
**0.2.0** — 2026-10-20 — extensão validada na conta Free (roteiro 5/5). **0.2.1 (não lançada)** corrige a parada com a janela minimizada (FIX-002).

## ✅ Funcionando
- Extensão 0.2.0 (`3c5a1ac`):
  - fora de um Projeto, o ícone mostra «!»;
  - entrando pela barra lateral, abre a lista sozinho;
  - Cancelar, Parar e continuar, «Pronto».
- 0.2.1 no ambiente do chat: `npm test` 32 OK; as mutações do relógio derrubam o 11c e o 11e.

## 🔧 Em Progresso
- **wo0005** (`meta/workorders/261020-wo0005-fix-002-aba-oculta.md`): versionar a 0.2.1, os prints e os docs.

## ❌ Quebrado / Com Problema
- 0.2.0 para no meio com a janela minimizada (FIX-002). Corrigido na 0.2.1, ainda não versionado nem testado no site.
- **«asehub» (conta Free) está com 14 arquivos restantes** da parada; um clique no ícone, com a 0.2.1, termina.

## 📋 Backlog (curto prazo — itens acionáveis)
- [ ] Aplicar a wo0005 no Code.
- [ ] Recarregar a extensão (↻) e terminar o «asehub» com a janela minimizada por 1–2 minutos.
- [ ] Decidir se os prints do README podem ir para o GitHub (mostram o nome «Canção» e oito nomes de arquivo).

## 💬 Última conversa
**2026-10-20 (2ª)** — wo0004 aplicada (`3c5a1ac`). Roteiro da extensão 5/5; F2 concluída. Achado nos prints: com a janela minimizada, parou em 19/33 por estouro de tempo; corrigido com `visibleClock()` (FIX-002, 0.2.1). O dono perguntou sobre `_TEMPLATE.md`: a restrição é só da pasta da extensão; arquivos do Projeto com «_» saem normalmente (caso 11d). Prints recortados para o README.
