# WO 0001 — Versionar o trecho de console da F1 e ligar `npm test`

> **Tipo:** mista — código novo gravado pelo chat, com hashes conferidos, mais três edições pequenas de configuração.
> **Config sugerida:** modelo mais capaz · `/effort` médio. O código já está escrito e testado; o trabalho é conferir, instalar, validar e commitar.
> **Pré-requisito:** HEAD `f107954` (docs: decide seguir o ClearDrop so para o layout limbo), sem commits locais depois dele. A árvore NÃO está limpa: tem os arquivos listados abaixo, gravados pelo chat.
> **Base:** DEC-004 (seguir só para o layout «limbo»), DEC-005 (testes em jsdom); medição `../referencia/free-261018-observa-remocao.md`.
> **Canal dos meta:** CHAT. Os `meta/` e o log já foram escritos pelo chat e só são VERSIONADOS aqui; esta WO não edita nenhum documento `meta/`.
> **Âncora semântica:** se um trecho-âncora não bater EXATAMENTE, **PARE e reporte**.
> **Idempotência:** antes de cada edição, procure o texto NOVO; se já existir, PULE e diga no relatório.

**Arquivos que o chat gravou no disco e esta WO versiona** (`sha1sum` medido ao gravar):

```
3bb13b744ab08b0b1a79679b5c44ab11b05c79fb  src/cleardrop.js
ddd3acad1bb1fcd92c925716c509c34f3b7cb670  tests/cleardrop.test.js
842f31f373d8214f5f078c6fb60be8d08a2e8751  tests/fixtures/modal-limbo.html
979a01edcc1f8ff9aba9b94fd867c2d65e01d666  package.json
f84aae27e16e20ff9eec1457ba8d7a820bb984aa  meta/CONTEXT.md
920b206e23cf9fa7f1a5275b24955160476f469b  meta/DECISIONS.md
764d9fb91928e23b623768a34259ca27b992ca9d  meta/STATUS.md
dc5ff316f88ac403038b46eda091ed6e49af7aca  meta/ROADMAP.md
b0ad688fd4e47e80e8163529614b8f28e4235b84  meta/CHANGELOG.md
84094cda9def4f1f25db56f48f700f8955582459  meta/IDEAS.md
c75f37be7c96f1e5114565d7d836d922bbf042ee  logs/2026-10-18.md
```

**Âncoras lidas em** (lidas pelo chat neste turno, do disco):
- Edição 1 — `.gitignore`, última linha: `*.pem`
- Edição 2 — `CLAUDE.md`, seção «Build / validação», duas linhas:
  `- Build: \`<seu comando de build, ex.: npm run build>\`  (PLACEHOLDER — troque pelo do seu projeto)` e
  `- Testes/validação: \`<seu comando de teste>\` — rode antes de commitar mudança de código.`
- Edição 3 — `.claude/settings.json`, linha 5:
  `      "Bash(git status:*)", "Bash(git diff:*)", "Bash(git add:*)", "Bash(git commit:*)", "Bash(git push:*)"`

---

## 1. Por que
A F1 entrega o trecho de console que esvazia um Projeto no layout «limbo». O chat escreveu e testou o código em jsdom (8/8 verdes no ambiente dele) e gravou tudo no disco. Falta quem tem o repositório: conferir que nada mudou desde então, instalar o jsdom, rodar os testes nesta máquina e versionar. As três edições ligam `npm test` como a validação oficial do projeto.

## Edição 0 — conferir os hashes (nenhuma escrita)
Rode `sha1sum` nos onze arquivos do cabeçalho. Qualquer hash diferente: **PARE e reporte** — outro escritor mexeu depois do chat. Não commite por cima.

## Edição 1 — `.gitignore` · ignorar `node_modules/`

**Âncora** (última linha do arquivo):

```
*.pem
```

**Substituir por:**

```
*.pem
# Dependencias de desenvolvimento (jsdom, so para os testes).
node_modules/
```

## Edição 2 — `CLAUDE.md` · validação vira `npm test`

**Âncora** (seção «Build / validação», as duas primeiras linhas da lista):

```
- Build: `<seu comando de build, ex.: npm run build>`  (PLACEHOLDER — troque pelo do seu projeto)
- Testes/validação: `<seu comando de teste>` — rode antes de commitar mudança de código.
```

**Substituir por:**

```
- Build: não há — `src/cleardrop.js` é colado no console como está.
- Testes/validação: `npm test` (jsdom sobre o modal real; precisa de `npm install` uma vez) — rode antes de commitar mudança de código. Esperado: `TODOS OK`, saída 0.
```

## Edição 3 — `.claude/settings.json` · permitir os comandos de validação

**Âncora** (linha da lista `allow`):

```
      "Bash(git status:*)", "Bash(git diff:*)", "Bash(git add:*)", "Bash(git commit:*)", "Bash(git push:*)"
```

**Substituir por:**

```
      "Bash(git status:*)", "Bash(git diff:*)", "Bash(git add:*)", "Bash(git commit:*)", "Bash(git push:*)",
      "Bash(npm install:*)", "Bash(npm test:*)", "Bash(node --check:*)"
```

## Edição 4 — instalar e validar (sem edição de texto)
1. `npm install` — cria `node_modules/` (ignorado pela Edição 1) e `package-lock.json` (versionado).
2. `node --check src/cleardrop.js`
3. `npm test` — esperado: oito linhas `OK`, a última linha `TODOS OK`, saída 0. Qualquer `FALHA`: **PARE**, não commite, e reporte a saída crua.

---

## Fora de escopo
- Não alterar `src/cleardrop.js`, `tests/` nem nenhum `meta/`. Achou defeito? Reporte; a correção volta ao chat.
- Não escrever README: ele espera o roteiro manual na conta Free.
- Não abrir o claude.ai nem rodar o trecho num Projeto real.

## Armadilhas desta WO
- **O teste 8 depende de tempo** (chama `stop()` 400 ms depois de começar). Numa máquina muito lenta ele pode parar antes da primeira remoção: o teste exige pelo menos uma removida, e falha com «restaram 35». Se acontecer, rode `npm test` de novo uma vez e reporte as duas saídas; não ajuste o teste.

## Depois de aplicar — conferência antes do commit
- [ ] `git status --short` mostra exatamente:
  - **modificados:** `.gitignore`, `CLAUDE.md`, `.claude/settings.json`, `meta/CONTEXT.md`, `meta/DECISIONS.md`, `meta/STATUS.md`, `meta/ROADMAP.md`, `meta/CHANGELOG.md`, `meta/IDEAS.md`, `logs/2026-10-18.md`;
  - **novos:** `src/`, `tests/`, `package.json`, `package-lock.json`, `meta/workorders/261018-wo0001-f1-cleardrop-console.md`;
  - **nada de `node_modules/`.**
- [ ] `grep -c '^node_modules/$' .gitignore` → `1` (linhas).
- [ ] `grep -c '^- Testes/validação: `npm test`' CLAUDE.md` → `1` (linhas).
- [ ] `node -e "JSON.parse(require('fs').readFileSync('.claude/settings.json','utf8'));console.log('JSON_OK')"` → `JSON_OK`.
- [ ] `npm test` → `TODOS OK`, saída 0 (saída crua no relatório).
- [ ] `git diff` dos três arquivos editados mostra só as Edições 1 a 3.
- [ ] Nada foi criado fora do repositório (o `npm install` escreve só em `node_modules/` e no cache do npm).

## Commit — blocos separados, mensagem SEM acento
```
git add .gitignore CLAUDE.md .claude/settings.json package.json package-lock.json src tests meta logs
```
```
git commit -m "feat: trecho de console ClearDrop 0.1.0 com testes em jsdom" -m "Remove arquivos do Projeto no layout limbo com confirmacao digitada e paradas de seguranca. Liga npm test como validacao (DEC-005)."
```
```
git push
```
