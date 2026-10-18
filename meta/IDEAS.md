# IDEAS.md — Brainstorm e Visão

> Segundo cérebro. Nunca perde: ideia muda de status, não some.

---

## 💡 Ideias Ativas — Usuário
### 2026-10 — Extensão com um botão permanente
O pedido original: um botão na página do Projeto (ou no ícone da extensão) que esvazia os arquivos. Encaminhada como forma B, depois da prova em A (DEC-002).

---

## 🤖 Ideias Ativas — Assistente
### 2026-10-17 — Modo ensaio
Primeiro comando só lista e conta (nome do Projeto, N arquivos, nomes) sem excluir. Serve de teste diário de que os seletores ainda batem com o layout.

### 2026-10-17 — Autodiagnóstico de layout
Ao abrir, conferir cada entrada de `SELECTORS` e relatar qual falhou («achei o modal, não achei o menu do arquivo 1») antes de qualquer exclusão. Atende o requisito 5 (falhar alto).

### 2026-10-17 — Excluir uma seleção
Caixas de seleção na lista da própria ferramenta para excluir só parte dos arquivos (ex.: só os `__template-update`). Fora do escopo da v0.1.

### 2026-10-17 — Ciclo com o FlatDrop
Esvaziar e, em seguida, abrir o diálogo de upload do FlatDrop: os dois fecham o ciclo de atualização do Projeto.

### 2026-10-17 — Exportar a lista antes de apagar
Baixar um `.txt` com os nomes, tamanhos e datas excluídos — recibo do que saiu.

---

## 🛌 Adiadas
- **Forma D — repetir a requisição que a página faz ao excluir** — adiada porque é interface interna não documentada e exige leitura dos termos de uso — **volta quando** A/B quebrarem por layout duas vezes, ou se a exclusão por clique se mostrar lenta demais com 100+ arquivos. Medir só método, caminho e status (captura de tela), nunca HAR.
- **Publicar na Chrome Web Store** — adiada porque exige ler os termos de uso sobre automação de interface — **volta quando** a extensão estiver estável para o dono por um mês.
- **Rótulos multilíngues (en/pt-BR)** — adiada até medir se o item Excluir e a confirmação têm âncora sem texto — **volta quando** a análise de seletores mostrar dependência de texto.

---

## ✅ Concluídas
- (nenhuma ainda)

---

## 🚫 Descartadas
- **Forma C — userscript (Tampermonkey/Violentmonkey)** — descartada porque depende de outra extensão instalada e não ganha nada sobre B.
- **Forma E — criar Projeto novo em vez de esvaziar** — descartada porque perde o histórico de conversas do Projeto.
- **Forma F — pedir ao Claude in Chrome que clique** — descartada como solução: lenta, gasta uso, é o trabalho repetitivo que a ferramenta deve fazer. (Continua válida para **medir** o DOM, se o dono preferir.)

---

## 📮 Feedback para o Kit
- **2026-10-17** O guia de medição do prompt de início pedia «Copiar outerHTML» do menu ⋮ pelo DevTools; menus efêmeros fecham ao focar o DevTools, e o dono não conseguiu. Para medir UI efêmera, o kit deveria entregar um trecho de console que abre, captura e baixa o resultado.
- **2026-10-17** O prompt de início citava a pasta do kit como `projeto/`, mas ela já estava renomeada para `ClearDrop/`; e o README do kit diz «logs/ — um arquivo por sessão» enquanto o CEREBRO diz um por dia. Pequenas divergências que confundem o primeiro turno.
- **2026-10-17** Seção «Feedback para o ASU» removida do IDEAS: este projeto não usa o ASU.
