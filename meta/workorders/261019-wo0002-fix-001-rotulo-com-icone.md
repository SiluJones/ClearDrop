# WO 0002 — Versionar o ClearDrop 0.1.1 (FIX-001: rótulo do menu com glifo de ícone)

> **Tipo:** código, gravado pelo chat com hashes conferidos. Não há edição de texto para o Code: ele confere, sincroniza o lock, valida e commita.
> **Config sugerida:** modelo mais leve · `/effort` baixo. É conferência mecânica, com teste pronto.
> **Pré-requisito:** HEAD `a9cbfe2` (feat: trecho de console ClearDrop 0.1.0 com testes em jsdom). A árvore tem os arquivos abaixo, gravados pelo chat.
> **Base:** FIX-001 em `meta/DECISIONS.md`; relatos `../notas-arquivadas/261019-1153.txt` e os prints `../Captura de tela 2026-10-19 11*.png`.
> **Canal dos meta:** CHAT. Os `meta/` e o log já foram escritos e só são versionados aqui.
> **Âncoras lidas em:** não se aplica — esta WO não edita arquivo existente.

**Arquivos que o chat gravou no disco e esta WO versiona** (`sha1sum` medido ao gravar):

```
adcafe0b2712b35d7121adb2dffdc9c99e29dca6  src/cleardrop.js
43aee9e2775d92e03ba6970076044ca9f7cd6438  tests/cleardrop.test.js
2b14c7e10c83588350f21f921085aa682302c00d  tests/fixtures/menu-limbo.html
9d5de43c30af2557439bcba78fbe12d2163fe1ec  package.json
02c15314bca3d1e6e9e900745b87f4b840d53d05  meta/DECISIONS.md
425ad61290272fa1860e82b76df2ed25c9df6b32  meta/CHANGELOG.md
582f789701a9e6757218874060e606aafbce6acf  meta/CONTEXT.md
b8273d16a6e6ac8644fb7042337d75c3d393c605  meta/STATUS.md
cd94a94ef108fbf0c931458620a86b03459d12d8  meta/ROADMAP.md
cb1536fc98e9721420837e6d866e87d97a889cb7  meta/IDEAS.md
374cefbae0280b21f99dcc5f2fa7544e3f90c11b  logs/2026-10-19.md
```

---

## 1. Por que
No primeiro uso real, `run()` recusou o item «Remover do projeto». O texto do item começa com o glifo `U+E101` do ícone (`aria-hidden`), e o 0.1.0 comparava `textContent`. O 0.1.1 lê o rótulo sem o que é `aria-hidden`, e o teste passa a montar o menu a partir do outerHTML medido. No ambiente do chat, o 0.1.1 passa 11 casos, e o 0.1.0 com o fixture novo falha com a mesma mensagem do site.

## Edição 0 — conferir os hashes (nenhuma escrita)
Rode `sha1sum` nos onze arquivos acima. Qualquer hash diferente: **PARE e reporte**.

## Edição 1 — sincronizar o lock e validar (sem edição de texto)
1. `npm install` — o `package-lock.json` passa a dizer `0.1.1` nas duas linhas do pacote raiz. Nenhuma dependência nova.
2. `node --check src/cleardrop.js`
3. `npm test` — esperado: **11 linhas `OK`** (casos 1, 1, 1b, 2, 3, 4, 5, 6, 7, 8a, 8b), a última `TODOS OK`, saída 0. Conte com `npm test | grep -c '^OK'`. Qualquer `FALHA`: **PARE**, não commite, reporte a saída crua.
4. Contraprova do FIX-001, sem gravar nada:
   1. `git show a9cbfe2:src/cleardrop.js > ../cleardrop-0.1.0.tmp.js`
   2. `node -e "require('fs').copyFileSync('src/cleardrop.js','../cleardrop-0.1.1.tmp.js');require('fs').copyFileSync('../cleardrop-0.1.0.tmp.js','src/cleardrop.js')"` e `npm test`. **Esperado: falhas**, entre elas a do caso 4, com «não é o esperado: «Remover do projeto»».
   3. Restaure: `node -e "require('fs').copyFileSync('../cleardrop-0.1.1.tmp.js','src/cleardrop.js')"`, confira que `sha1sum src/cleardrop.js` voltou a `adcafe0b…`, e apague os dois `.tmp.js` da pasta-pai.

---

## Fora de escopo
- Não alterar `src/`, `tests/` nem `meta/`. Achou defeito? Reporte.
- Não abrir o claude.ai.

## Armadilhas desta WO
- **O fixture `tests/fixtures/menu-limbo.html` contém de propósito um caractere invisível** (`U+E101`, bytes `EE 84 81`), dentro do `span` do ícone. Não «limpe» o arquivo e não o abra num editor que reescreva a codificação: o hash da Edição 0 acusaria, e o caso 1b existe para pegar isso.

## Depois de aplicar — conferência antes do commit
- [ ] `git status --short` mostra exatamente:
  - **modificados:** `src/cleardrop.js`, `tests/cleardrop.test.js`, `package.json`, `package-lock.json`, `meta/DECISIONS.md`, `meta/CHANGELOG.md`, `meta/CONTEXT.md`, `meta/STATUS.md`, `meta/ROADMAP.md`, `meta/IDEAS.md`;
  - **novos:** `tests/fixtures/menu-limbo.html`, `logs/2026-10-19.md`, `meta/workorders/261019-wo0002-fix-001-rotulo-com-icone.md`.
- [ ] `npm test | grep -c '^OK'` → `11` (linhas).
- [ ] `grep -c '"version": "0.1.1"' package-lock.json` → `2` (linhas).
- [ ] Contraprova da Edição 1.4 feita, `src/cleardrop.js` restaurado (hash `adcafe0b…`) e nenhum `.tmp.js` sobrou na pasta-pai.

## Commit — blocos separados, mensagem SEM acento
```
git add src tests package.json package-lock.json meta logs
```
```
git commit -m "fix: aceita o item Remover do projeto com glifo de icone (FIX-001)" -m "ClearDrop 0.1.1 le o rotulo sem o conteudo aria-hidden. Testes montam o menu a partir do outerHTML medido."
```
```
git push
```
