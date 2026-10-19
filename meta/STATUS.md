# STATUS.md — Estado Atual

> Arquivo **rolante**: só o AGORA. Resolvido sai daqui; médio prazo mora no ROADMAP.

---

## Versão Atual
**0.1.0 (não lançada)** — 2026-10-18 — `src/cleardrop.js` escrito e testado em jsdom (8/8); falta o roteiro manual na conta Free.

## ✅ Funcionando
- `src/cleardrop.js`:
  - `scan()` — ensaio;
  - `run()` — remoção com confirmação digitada;
  - `stop()`;
  - recusa no layout com «Selecionar».
- `npm test`: 8 casos sobre o modal real — ensaio, recusa, rodapé divergente, esvaziamento completo, confirmação errada, menu inesperado, diálogo inesperado, parada e retomada.

## 🔧 Em Progresso
- **WO `meta/workorders/261018-wo0001-f1-cleardrop-console.md`:** o Code confere os hashes, instala o jsdom, liga `npm test` ao CLAUDE.md e às permissões, roda os testes e commita.

## ❌ Quebrado / Com Problema
- Nada conhecido.

## 📋 Backlog (curto prazo — itens acionáveis)
- [ ] Aplicar a wo0001 no Code.
- [ ] Roteiro manual na conta Free: ensaio, depois esvaziar um Projeto descartável.
- [ ] README com o uso, depois do roteiro (prints: a tabela do `scan()` e o aviso final do `run()`).

## 💬 Última conversa
**2026-10-18 (2ª)** — Observador mostrou que «Remover do projeto» não confirma e que a lista recarrega com spinner. Escritos `src/cleardrop.js`, os testes em jsdom e o fixture; 8/8 verdes aqui. Gravados no repo com hashes conferidos; WO para o Code versionar.
