# STATUS.md — Estado Atual

> Arquivo **rolante**: só o AGORA. Resolvido sai daqui; médio prazo mora no ROADMAP.

---

## Versão Atual
**0.2.1** — 2026-10-20 (`2f2c968`) — **parada desde 06/11:** o site passou a pedir confirmação ao remover, e o ClearDrop para no primeiro arquivo (a guarda funcionou: nada removido às cegas). Próxima frente: F2.2 (ROADMAP).

## ✅ Funcionando
- Extensão 0.2.1, **até 05/11** (em 06/11 o site mudou — ver «Quebrado»):
  - ícone → abre a lista sozinho → janela com Cancelar/Remover → progresso com Parar → «Pronto»;
  - continua com a janela minimizada, só mais devagar;
  - recusa no layout com «Selecionar».
- `npm test` 32 OK. Console (`extension/cleardrop.js` colado) continua funcionando.

## 🔧 Em Progresso
- **F2.2 — adaptar à confirmação do site.** Primeiro passo: medir o DOM do diálogo «Remover <arquivo>?» com o observador `../261018-GUIA-OBSERVAR-REMOCAO.md` (ele já registra diálogos novos), confirmando a remoção da cobaia.
- **Ícone próprio:** pedido do dono em 06/11 (o «C» genérico colide com outra extensão dele); desenho em aberto.

## ❌ Quebrado / Com Problema
- **0.2.1 não remove nada desde 06/11** [relatado pelo dono em `261106-1752.txt` + 3 prints de 06/11 vistos pelo chat]: ao clicar «Remover do projeto», o site abre «Remover <arquivo>? / Isso não pode ser desfeito.» com **Cancelar** e **Remover arquivo**; o ClearDrop para com «Apareceu um diálogo inesperado… Removidos 0». Visto na conta Free «João Lucas», Projeto «Fileview» (41 arquivos; o dono removeu alguns à mão entre as tentativas).
- `extension/Terra.pdf` (4,8 MB) está não rastreado DENTRO da pasta que o Chrome carrega, desde 21/10; o dono decide (recomendação do chat: tirar de `extension/`).

## 📋 Backlog (curto prazo — itens acionáveis)
- [ ] Dono roda o observador numa conta no layout «limbo» e confirma a remoção da cobaia; traz o `.md` baixado para a pasta-pai.
- [ ] Dono decide `extension/Terra.pdf`.
- [ ] Dono decide sobre a pausa mais curta entre arquivos (IDEAS, 21/10; sem resposta até 24/11).
- [ ] Template-update do KCM v1.162.1 chegou em 24/11 (`../261124-kcm-update-dev-v1.162.1/`): merge pendente. O pacote fica na pasta-pai até o merge fechar.

## 💬 Última conversa
**2026-11-24** — Fecho da conversa longa (17/10–24/11), com handoff em `../261124-HANDOFF-BRIEF.md`. Registrados: a confirmação do site que parou o ClearDrop (06/11), o pedido de ícone, o `Terra.pdf`, o template-update do KCM e as decisões do dono de 21/10 — os prints do README ficam no GitHub; o projeto estava em manutenção [relatado pelo dono].

**2026-10-21** — wo0006 aplicada pelo Code (`b7514ca`, empurrada): 6 hashes conferidos, registro da 0.2.1 versionado. Sobrou `extension/Terra.pdf` não rastreado (fora da WO, intocado); dono decide se fica ou sai.

**2026-10-20 (4ª)** — wo0005 aplicada (`2f2c968`) e `/wrap` do Code (`e0dc674`). Roteiro minimizado no «asehub»: 3/3, terminou os 14 arquivos. 0.2.1 cortada no CHANGELOG. O projeto cumpre o objetivo; próximos passos em aberto.

**2026-10-20 (3ª)** — wo0005 aplicada pelo Code (`2f2c968`, empurrada): 14 hashes conferidos, lock 0.2.1, 32 OK.
