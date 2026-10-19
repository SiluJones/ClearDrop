# WO 0003 — Registrar a F1 concluída (0.1.1 no site real)

> **Tipo:** só de doc (registro). Sem build: a rede é o `git diff`.
> **Config sugerida:** modelo mais leve · `/effort` baixo.
> **Pré-requisito:** HEAD `cfe80aa`. A árvore tem os arquivos abaixo, gravados pelo chat.
> **Canal dos meta:** CHAT — já escritos; esta WO só versiona.
> **Âncoras lidas em:** não se aplica — não edita arquivo existente.

**Arquivos que o chat gravou e esta WO versiona** (`sha1sum` ao gravar):

```
e38edc2e394af9fef02f3bf76c12c1e6582648df  meta/CHANGELOG.md
cb23c2dc74106b4a898d93ded970f014d10228e5  meta/IDEAS.md
bab99695adb0d9559f6e0132e3ffa210145db114  meta/ROADMAP.md
2ed357a65577cfd42ffa9152e6048e9ca7302525  meta/STATUS.md
bb73749f9c87b3897a0fdd2d2c32e5143f05d9b7  logs/2026-10-19.md
```

## Edição 0 — conferir os hashes
`sha1sum` nos arquivos acima. Diferente: **PARE e reporte**.

## Depois de aplicar — conferência antes do commit
- [ ] `git status --short` mostra exatamente:
  - **modificados:** `meta/CHANGELOG.md`, `meta/IDEAS.md`, `meta/ROADMAP.md`, `meta/STATUS.md`, `logs/2026-10-19.md`;
  - **novo:** esta WO.
- [ ] `grep -c '^## \[0.1.1\] — 2026-10-19' meta/CHANGELOG.md` → `1` (linhas).

## Commit — blocos separados, mensagem SEM acento
```
git add meta logs
```
```
git commit -m "docs: registra F1 concluida com o ClearDrop 0.1.1 no site real"
```
```
git push
```
