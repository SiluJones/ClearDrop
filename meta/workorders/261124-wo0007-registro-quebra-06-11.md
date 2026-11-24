# WO 0007 — Registrar a quebra de 06/11, o pedido de ícone e o fecho da conversa

> **Tipo:** só de doc (registro). Sem build: a rede é o `git diff`.
> **Config sugerida:** modelo mais leve · `/effort` baixo.
> **Pré-requisito:** HEAD `ea47380` (docs: wrap da sessao - wo0006 aplicada, Terra.pdf pendente de decisao). Na árvore: `?? extension/Terra.pdf` (NÃO entra nesta WO) e `logs/2026-11-24.md` novo, gravado pelo chat.
> **Canal dos meta:** CHAT autora o texto; o Code POSICIONA as edições abaixo e versiona o log novo.
> **Âncora semântica:** se uma âncora não bater EXATAMENTE, **PARE e reporte**.
> **Idempotência:** antes de cada edição, procure o texto novo; se já existir, PULE e diga no relatório.
> **Âncoras lidas em:** cada âncora abaixo foi RECORTADA por script do arquivo vivo em 24/11, com contagem 1 conferida; arquivos em LF (`git ls-files --eol`: `i/lf w/lf`).

**Arquivo que o chat gravou e esta WO versiona** (`sha1sum` ao gravar):

```
1376c4b9385c5b15a376a6e67e314c9dde7be236  logs/2026-11-24.md
```

## 1. Por que
Fecho da conversa longa. Em 06/11 o site passou a pedir confirmação ao remover, e o ClearDrop 0.2.1 parou: a guarda de «diálogo inesperado» funcionou. O dono pediu um ícone próprio. Esta WO:
- registra isso no STATUS;
- abre a F2.2 no ROADMAP;
- corrige a seção crítica do CONTEXT;
- reclassifica a ideia do ícone.

Nada de código.

## Edição 0 — conferir o hash do log
`sha1sum logs/2026-11-24.md`. Diferente: **PARE e reporte**.

## Edição 1 — `meta/STATUS.md` · substituir a linha-âncora

**Âncora** (linha inteira):

```
**0.2.1** — 2026-10-20 (`2f2c968`) — extensão estável na conta Free, inclusive com a janela minimizada. F1 e F2 concluídas; nada em andamento.
```

**Substituir por:**

```
**0.2.1** — 2026-10-20 (`2f2c968`) — **parada desde 06/11:** o site passou a pedir confirmação ao remover, e o ClearDrop para no primeiro arquivo (a guarda funcionou: nada removido às cegas). Próxima frente: F2.2 (ROADMAP).
```

## Edição 2 — `meta/STATUS.md` · substituir a linha-âncora

**Âncora** (linha inteira):

```
- Extensão 0.2.1:
```

**Substituir por:**

```
- Extensão 0.2.1, **até 05/11** (em 06/11 o site mudou — ver «Quebrado»):
```

## Edição 3 — `meta/STATUS.md` · substituir a linha-âncora

**Âncora** (linha inteira):

```
- Nada.
```

**Substituir por:**

```
- **F2.2 — adaptar à confirmação do site.** Primeiro passo: medir o DOM do diálogo «Remover <arquivo>?» com o observador `../261018-GUIA-OBSERVAR-REMOCAO.md` (ele já registra diálogos novos), confirmando a remoção da cobaia.
- **Ícone próprio:** pedido do dono em 06/11 (o «C» genérico colide com outra extensão dele); desenho em aberto.
```

## Edição 4 — `meta/STATUS.md` · substituir a linha-âncora

**Âncora** (linha inteira):

```
- Nada conhecido.
```

**Substituir por:**

```
- **0.2.1 não remove nada desde 06/11** [relatado pelo dono em `261106-1752.txt` + 3 prints de 06/11 vistos pelo chat]: ao clicar «Remover do projeto», o site abre «Remover <arquivo>? / Isso não pode ser desfeito.» com **Cancelar** e **Remover arquivo**; o ClearDrop para com «Apareceu um diálogo inesperado… Removidos 0». Visto na conta Free «João Lucas», Projeto «Fileview» (41 arquivos; o dono removeu alguns à mão entre as tentativas).
- `extension/Terra.pdf` (4,8 MB) está não rastreado DENTRO da pasta que o Chrome carrega, desde 21/10; o dono decide (recomendação do chat: tirar de `extension/`).
```

## Edição 5 — `meta/STATUS.md` · substituir a linha-âncora

**Âncora** (linha inteira):

```
- [ ] Dono decide se os prints do README ficam no GitHub (já empurrados em `2f2c968`; mostram o nome «Canção» e oito nomes de arquivo).
```

**Substituir por:**

```
- [ ] Dono roda o observador numa conta no layout «limbo» e confirma a remoção da cobaia; traz o `.md` baixado para a pasta-pai.
```

## Edição 6 — `meta/STATUS.md` · substituir a linha-âncora

**Âncora** (linha inteira):

```
- [ ] Dono escolhe o próximo passo, ou nenhum: ícone próprio, progresso no título da aba, F3 (autodiagnóstico de layout), ou deixar o projeto em manutenção.
```

**Substituir por:**

```
- [ ] Dono decide `extension/Terra.pdf`.
- [ ] Dono decide sobre a pausa mais curta entre arquivos (IDEAS, 21/10; sem resposta até 24/11).
- [ ] Template-update do KCM v1.162.1 chegou em 24/11 (`../261124-kcm-update-dev-v1.162.1/`): merge pendente. O pacote fica na pasta-pai até o merge fechar.
```

## Edição 7 — `meta/STATUS.md` · substituir a linha-âncora

**Âncora** (linha inteira):

```
**2026-10-21** — wo0006 aplicada pelo Code (`b7514ca`, empurrada): 6 hashes conferidos, registro da 0.2.1 versionado. Sobrou `extension/Terra.pdf` não rastreado (fora da WO, intocado); dono decide se fica ou sai.
```

**Substituir por:**

```
**2026-11-24** — Fecho da conversa longa (17/10–24/11), com handoff em `../261124-HANDOFF-BRIEF.md`. Registrados: a confirmação do site que parou o ClearDrop (06/11), o pedido de ícone, o `Terra.pdf`, o template-update do KCM e as decisões do dono de 21/10 — os prints do README ficam no GitHub; o projeto estava em manutenção [relatado pelo dono].

**2026-10-21** — wo0006 aplicada pelo Code (`b7514ca`, empurrada): 6 hashes conferidos, registro da 0.2.1 versionado. Sobrou `extension/Terra.pdf` não rastreado (fora da WO, intocado); dono decide se fica ou sai.
```

## Edição 8 — `meta/ROADMAP.md` · substituir a linha-âncora

**Âncora** (linha inteira):

```
## 🔵 F3 — Robustez
```

**Substituir por:**

```
## 🟡 F2.2 — Confirmação do site e ícone *(próxima — aberta em 24/11)*
**Objetivo:** voltar a esvaziar no layout «limbo» agora que «Remover do projeto» abre a confirmação «Remover <arquivo>? Isso não pode ser desfeito.» (desde 06/11), e dar à extensão um ícone próprio.
**Critério de conclusão:** na conta Free, ícone → Remover esvazia um Projeto descartável passando pela confirmação do site arquivo a arquivo, confirmando só o diálogo cujo título nomeia o arquivo da vez; o ícone se distingue do outro «C» da barra.
- [ ] Medir o DOM do diálogo de confirmação (observador `../261018-GUIA-OBSERVAR-REMOCAO.md`, confirmando a cobaia).
- [ ] Núcleo: tratar a confirmação esperada (título com o nome do arquivo + botão «Remover arquivo») e seguir parando em qualquer outro diálogo; fixture do diálogo medido; mutação.
- [ ] Ícone: PNG 16/32/48/128 em `extension/icons/` + `icons` e `action.default_icon` no manifest.
- [ ] Roteiro na conta Free.

## 🔵 F3 — Robustez
```

## Edição 9 — `meta/CONTEXT.md` · substituir a linha-âncora

**Âncora** (linha inteira):

```
  - **«Remover do projeto» não pede confirmação:** a linha some ~1,3 s depois de o menu abrir, sem diálogo. A confirmação digitada do ClearDrop é a única proteção.
```

**Substituir por:**

```
  - **«Remover do projeto» não pedia confirmação até 05/11:** a linha sumia ~1,3 s depois de o menu abrir. **Desde 06/11 pede** [prints de 06/11; DOM ainda não medido]: diálogo «Remover <arquivo>? / Isso não pode ser desfeito.» com **Cancelar** e **Remover arquivo**. O ClearDrop 0.2.1 trata isso como diálogo inesperado e para (F2.2).
```

## Edição 10 — `meta/IDEAS.md` · substituir a linha-âncora

**Âncora** (linha inteira):

```
### 2026-10-20 — Ícone próprio da extensão
```

**Substituir por:**

```
### 2026-10-20 — Ícone próprio da extensão *(pedido pelo dono em 06/11 → F2.2)*
O dono já usa outra extensão com «C»: as duas ficam iguais na barra (visível nos prints de 06/11). Ele vai pedir um ícone também no outro projeto; aqui, preparar o daqui. Desenho em aberto.
```

## Fora de escopo
- Não tocar `extension/` (inclusive o `Terra.pdf`), `tests/` nem outro `meta/`.
- Não mexer no pacote `../261124-kcm-update-dev-v1.162.1/`: o merge do template é outra tarefa.

## Depois de aplicar — conferência antes do commit
- [ ] `git status --short` mostra:
  - **modificados:** `meta/STATUS.md`, `meta/ROADMAP.md`, `meta/CONTEXT.md`, `meta/IDEAS.md`;
  - **novos:** `logs/2026-11-24.md` e esta WO;
  - **fora do commit:** `?? extension/Terra.pdf`, que continua aí.
- [ ] Contagens em LINHAS (`grep -c`), obtidas rodando o mesmo `grep` sobre cópias com as edições simuladas:
  - `grep -c '^\*\*0\.2\.1\*\* — 2026-10-20 (`2f2c968`) — \*\*parada desde 06/11' meta/STATUS.md` → `1`
  - `grep -c '^- \*\*F2\.2 — adaptar à confirmação do site' meta/STATUS.md` → `1`
  - `grep -c '^- \*\*0\.2\.1 não remove nada desde 06/11' meta/STATUS.md` → `1`
  - `grep -c '^\*\*2026-11-24\*\* — Fecho da conversa longa' meta/STATUS.md` → `1`
  - `grep -c '^- Nada conhecido\.$' meta/STATUS.md` → `0`
  - `grep -c '^## 🟡 F2\.2 — Confirmação do site e ícone' meta/ROADMAP.md` → `1`
  - `grep -c '^  - \*\*«Remover do projeto» não pedia confirmação até 05/11' meta/CONTEXT.md` → `1`
  - `grep -c '^  - \*\*«Remover do projeto» não pede confirmação:' meta/CONTEXT.md` → `0`
  - `grep -c '^### 2026-10-20 — Ícone próprio da extensão \*(pedido pelo dono em 06/11' meta/IDEAS.md` → `1`
- [ ] `git diff` mostra só as Edições 1 a 10.
- [ ] Não rode `/wrap` depois desta WO: o registro já está feito.

## Commit — blocos separados, mensagem SEM acento
```
git add meta logs
```
```
git commit -m "docs: registra a confirmacao do site de 06/11 e o fecho da conversa"
```
```
git push
```
