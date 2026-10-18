# ANÁLISE — Forma de automação e seletores do ClearDrop

**Data:** 2026-10-17 · **Status:** Em discussão

## Problema
O ClearDrop nasceu porque o modal de arquivos do Projeto perdeu o «selecionar todos + excluir» (out/2026), e esvaziar 35–173 arquivos virou um clique por arquivo. A F0 existia para medir o modal antes de escolher a forma (DEC-002) e os seletores (DEC-003).

## Restrições / o que foi medido

### 1. O caminho por linha — medido pelo dono, 2026-10-17
Fonte: `../../261017-medicao-menu.md`, no Projeto *mapsmith* com 174 arquivos.
- **O menu ⋮ abre com `.click()`.** Não precisou da sequência de eventos de ponteiro.
- **O menu tem um único item:** `role="menuitem"` com o texto **«Remover do projeto»** — não «Excluir». O menu tem `role="menu"` e `data-cds="Menu"`.
- **O Escape fecha o menu.**
- **Sem virtualização até 174 arquivos.** As 174 linhas estão no DOM antes e depois de rolar, embora a lista role (610 px visíveis de 7.862 px).

### 2. A confirmação — não medida
Fonte: `../../261017-medicao-confirmacao.md`.
- **Não havia caixa de confirmação aberta.** O trecho capturou um único diálogo, o próprio modal, com o `teste-cleardrop.txt` ainda listado.
- **Não se sabe se «Remover do projeto» pede confirmação.**

### 3. O modal mudou, e a exclusão em lote voltou — medido ao vivo, 2026-10-17 ~22h
Fonte: Claude in Chrome, no *mapsmith*, conta Pro.
- **O que mudou no modal:** título «Contexto» (era «Arquivos»), colunas «Nome / Tamanho / Detalhes» e um botão **«Selecionar»** (`aria-pressed`). Região `role="region"` com `aria-label="Arquivos de contexto"`. Rodapé: «173 arquivos · 50%».
- **Ao ligar «Selecionar»** aparecem:
  - uma caixa **«Selecionar tudo»** (`role="checkbox"`);
  - uma caixa por linha (`aria-label="Selecionar <arquivo>"`);
  - o texto «N selecionado»;
  - os botões **`aria-label="Excluir N item selecionado"`** e **«Cancelar»**.
- **Ao marcar «Selecionar tudo»:** «173 selecionado» e o botão vira **«Excluir 173 itens selecionados», habilitado**.
- **Cancelado sem excluir:** o rodapé seguiu em 173.

### 4. O que não foi medido
- **O que a conta gratuita mostra hoje.**
  - O `261017-0707.html` (35 arquivos, sem «Selecionar») foi tirado de manhã, em conta não identificada.
  - A captura de 16/10 era de conta Free.
  - Não dá para separar «a Anthropic devolveu o recurso a todos» de «só o plano Pro tem».
- **Se a exclusão em lote pede confirmação.** O botão nunca foi clicado.

## Opções consideradas
- **A. Encerrar o ClearDrop.** O recurso nativo cumpre os requisitos 1 a 3 sem nada a manter. O esvaziamento vira cinco gestos:
  1. abrir o contexto;
  2. Selecionar;
  3. Selecionar tudo;
  4. Excluir;
  5. confirmar, se houver.
  - Custo: zero.
  - Risco: o recurso sumir de novo; nesse caso, as medições desta F0 retomam o projeto em minutos.
- **B. Manter como rede de segurança dormente.** Guardar as medições do caminho por linha. Se o «Selecionar» sumir, ou não existir na conta gratuita, um trecho de console usa o caminho por linha.
  - Custo: nenhum até o gatilho.
- **C. Seguir com a extensão (forma B do DEC-002) sobre o recurso nativo.** Um botão que faz os cinco gestos.
  - Ganho: quatro cliques.
  - Custo: manifesto, permissões e manutenção a cada mudança de layout.
  - Descartada: o ganho não paga a manutenção.
- **D. Seguir com a extensão sobre o caminho por linha.** Descartada enquanto o recurso nativo existir: reconstrói o que a interface já faz.

## Recomendação
**A + B: encerrar o desenvolvimento agora e deixar o projeto dormente**, com um gatilho escrito para voltar. Antes disso falta **uma** medição barata, que decide entre «encerrar» e «seguir só para a conta gratuita»: abrir um Projeto numa **conta gratuita** e ver se o botão «Selecionar» aparece.

Se o projeto voltar, os seletores já medidos para o caminho por linha são estes (todos sob o modal identificado por `[data-testid="project-doc-upload"]`, conforme DEC-003):

| Nome em `SELECTORS` | Seletor | Depende de idioma? |
|---|---|---|
| `filesModal` | `[role="dialog"]` que contém `[data-testid="project-doc-upload"]` | não |
| `rowMenuTrigger` | `button[aria-haspopup="menu"]:not([data-testid])` | não |
| `openMenu` | `[role="menu"]` | não |
| `removeItem` | `[role="menu"] [role="menuitem"]`, **único item**; conferir o texto contra uma lista («Remover do projeto», «Remove from project») e parar se divergir | só a conferência |
| `fileCount` | rodapé `/(\d+)\s+arquivos?/` | sim; conferência, não âncora |

Para o recurso nativo, se algum dia valer automatizá-lo, as âncoras seriam:
- `button[aria-pressed]` dentro do cabeçalho;
- o **primeiro** `role="checkbox"` do modal, que é o «Selecionar tudo»;
- `button[aria-label^="Excluir"]`, cujo número no rótulo deve bater com o rodapé antes de clicar.

## Riscos
- **O recurso sumir ou mudar de novo.** É o gatilho da opção B: as medições desta pasta, mais o `../../261017-GUIA-MEDIR-MENU.md`, refazem a F0 em minutos.
- **Diferença entre planos.** Se a conta gratuita não tiver «Selecionar», o requisito 4 do projeto continua aberto e a recomendação muda para seguir com a F1, só no caminho por linha.

## Ponto de decisão
1. **Conta gratuita:** abra um Projeto numa conta Free e veja se o botão «Selecionar» aparece no topo da lista de arquivos.
2. **Com isso:**
   - **Aparece:** encerrar (A + B).
   - **Não aparece:** seguir com a F1 no console, só pelo caminho por linha.
