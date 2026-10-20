# WO 0005 — Versionar o ClearDrop 0.2.1 (FIX-002: aba oculta) e os prints do README

> **Tipo:** código e docs gravados pelo chat, com hashes conferidos. Não há edição de texto para o Code.
> **Config sugerida:** modelo mais leve · `/effort` baixo.
> **Pré-requisito:** HEAD `3c5a1ac` (feat: extensao ClearDrop 0.2.0 com confirmacao por clique (DEC-006)).
> **Base:** FIX-002 em `meta/DECISIONS.md`.
> **Canal dos meta:** CHAT — já escritos; esta WO só versiona.
> **Âncoras lidas em:** não se aplica — não edita arquivo existente.

**Arquivos que o chat gravou e esta WO versiona** (`sha1sum` ao gravar; os dois `.png` são binários):

```
5832bfe493e2bc663e9d9ff823ca88ee70bcce9a  extension/cleardrop.js
67ed72e3597d15f73a1eccd108963ceface9a0a7  extension/manifest.json
ae84a2c72a3ca158dcfe58f2236c54ca7444d228  tests/cleardrop.test.js
823db187de2d761ed96066952e85d4e06e2d81a8  package.json
c7f22bf856ab639de92b9695bb1e50c69b0978d2  docs/img/confirmacao.png
1d9e4f124d2574dca07fac857308829eca40454c  docs/img/pronto.png
fc4cf46b619e32291bd35cea8760c71b41f92bb0  README.md
42fab416251abc7e4064154f4777270ace1b718b  meta/CHANGELOG.md
979f2dd560d9a483cf86e6a7a5531b53fa292258  meta/CONTEXT.md
3b5532edc5c520aecc815070baa0cec905ebe411  meta/DECISIONS.md
a25dd600fccf7cd916849a9c81928355f440c57c  meta/IDEAS.md
ed42873f2cb75d46d417794ae13592f7a9c3fdba  meta/ROADMAP.md
def5f60626a85e7f0b28c66943c69e6f878ecad6  meta/STATUS.md
8b1764a25dbf3b33a9dd7764730af032932ecd78  logs/2026-10-20.md
```

## 1. Por que
Com a janela minimizada, a 0.2.0 parou no meio do «asehub» (19/33) porque mediu os tempos de espera no relógio de parede, e o Chrome desacelera abas ocultas. A 0.2.1 só conta o tempo com a aba visível. Os casos 11c e 11e provam isso: o relógio antigo derruba os dois e reproduz a mensagem real. Vão juntos os prints recortados da janela para o README.

## Edição 0 — conferir os hashes
`sha1sum` nos arquivos acima. Diferente: **PARE e reporte**.

## Edição 1 — sincronizar o lock e validar (sem edição de texto)
1. `npm install`.
2. `node -p "require('./package-lock.json').packages[''].version"` → `0.2.1`.
3. `node --check extension/cleardrop.js` e `node -e "JSON.parse(require('fs').readFileSync('extension/manifest.json','utf8'));console.log('MANIFEST_OK')"` → `MANIFEST_OK`.
4. `npm test` — esperado: **32 linhas `OK`**, a última `TODOS OK`, saída 0. Conte com `npm test | grep -c '^OK'`. Falha só no 8a, 16a, 11c ou 11e (casos com tempo): rode uma segunda vez e reporte as duas saídas. Outra falha: **PARE**.

## Fora de escopo
- Não alterar `extension/`, `tests/`, `docs/`, `README.md` nem `meta/`.

## Depois de aplicar — conferência antes do commit
- [ ] `git status --short` mostra:
  - **modificados:** `README.md`, `extension/cleardrop.js`, `extension/manifest.json`, `package.json`, `package-lock.json`, `tests/cleardrop.test.js`, `logs/2026-10-20.md`, e em `meta/`: `CHANGELOG.md`, `CONTEXT.md`, `DECISIONS.md`, `IDEAS.md`, `ROADMAP.md`, `STATUS.md`;
  - **novos:** `docs/` (2 imagens) e esta WO.
- [ ] `npm test | grep -c '^OK'` → `32`.

## Commit — blocos separados, mensagem SEM acento
```
git add README.md extension tests docs package.json package-lock.json meta logs
```
```
git commit -m "fix: remocao nao para com a janela minimizada (FIX-002)" -m "ClearDrop 0.2.1 mede os tempos de espera so com a aba visivel. README ganha os prints da janela."
```
```
git push
```
