# WO 0006 — Registrar a 0.2.1 validada no site

> **Tipo:** só de doc (registro). Sem build: a rede é o `git diff`.
> **Config sugerida:** modelo mais leve · `/effort` baixo.
> **Pré-requisito:** HEAD `e0dc674`. A árvore tem os arquivos abaixo, gravados pelo chat **por cima** do que o `/wrap` escreveu em `e0dc674` (o chat leu a versão do `/wrap` antes de gravar).
> **Canal dos meta:** CHAT — já escritos; esta WO só versiona.
> **Âncoras lidas em:** não se aplica — não edita arquivo existente.

**Arquivos que o chat gravou e esta WO versiona** (`sha1sum` ao gravar):

```
3c7849fbfaa2f2173ee5ff02b7f5fa059461abcb  meta/CHANGELOG.md
acdc392728b9af99b129b1ffe36c435391275f77  meta/ROADMAP.md
8f82a5df46a5d06f775fc52577c847ccd3e9ae82  meta/STATUS.md
ce6e82833819516e69a23cd959cfecebf271b9d7  logs/2026-10-20.md
2924a9d4b7e8f860f1f26e515bd056b58224eb54  meta/IDEAS.md
6f3c07ce63169f142c2eba51b627a7890d16a645  logs/2026-10-21.md
```

## Edição 0 — conferir os hashes
`sha1sum` nos arquivos acima. Diferente: **PARE e reporte**.

## Depois de aplicar — conferência antes do commit
- [ ] `git status --short` mostra só: `meta/CHANGELOG.md`, `meta/IDEAS.md`, `meta/ROADMAP.md`, `meta/STATUS.md`, `logs/2026-10-20.md` modificados; `logs/2026-10-21.md` e esta WO novos.
- [ ] `grep -c '^## \[0.2.1\] — 2026-10-20' meta/CHANGELOG.md` → `1` (linhas).
- [ ] Não rode `/wrap` depois desta WO: o registro já está feito.

## Commit — blocos separados, mensagem SEM acento
```
git add meta logs
```
```
git commit -m "docs: registra ClearDrop 0.2.1 validada com a janela minimizada"
```
```
git push
```
