# STATUS.md — Estado Atual

> Arquivo **rolante**: só o AGORA. Resolvido sai daqui; médio prazo mora no ROADMAP.

---

## Versão Atual
**0.2.1** — 2026-10-20 (`2f2c968`, empurrada) — corrige a parada com a janela minimizada (FIX-002); ainda não testada no site. A 0.2.0 foi validada na conta Free (roteiro 5/5).

## ✅ Funcionando
- Extensão 0.2.0 (`3c5a1ac`):
  - fora de um Projeto, o ícone mostra «!»;
  - entrando pela barra lateral, abre a lista sozinho;
  - Cancelar, Parar e continuar, «Pronto».
- 0.2.1 (`2f2c968`): `npm test` 32 OK, `TODOS OK`; as mutações do relógio derrubam o 11c e o 11e. Prints no README.

## 🔧 Em Progresso
- Nada em código. Falta só o teste da 0.2.1 no site, com a janela minimizada (backlog).

## ❌ Quebrado / Com Problema
- 0.2.0 para no meio com a janela minimizada (FIX-002). Corrigido e versionado na 0.2.1 (`2f2c968`), ainda não testado no site.
- **«asehub» (conta Free) está com 14 arquivos restantes** da parada; um clique no ícone, com a 0.2.1, termina.

## 📋 Backlog (curto prazo — itens acionáveis)
- [ ] Recarregar a extensão (↻) e terminar o «asehub» com a janela minimizada por 1–2 minutos.
- [ ] Decidir se os prints do README podem ir para o GitHub (mostram o nome «Canção» e oito nomes de arquivo).

## 💬 Última conversa
**2026-10-20 (3ª)** — wo0005 aplicada pelo Code (`2f2c968`, empurrada): 14 hashes conferidos, lock 0.2.1, 32 OK. Pendente: o teste da 0.2.1 no «asehub» e a decisão sobre os prints.

**2026-10-20 (2ª)** — wo0004 aplicada (`3c5a1ac`). Roteiro da extensão 5/5; F2 concluída. Achado nos prints: com a janela minimizada, parou em 19/33 por estouro de tempo; corrigido com `visibleClock()` (FIX-002, 0.2.1). O dono perguntou sobre `_TEMPLATE.md`: a restrição é só da pasta da extensão; arquivos do Projeto com «_» saem normalmente (caso 11d). Prints recortados para o README.
