# IDEAS.md — Brainstorm e Visão

> Segundo cérebro. Nunca perde: ideia muda de status, não some.

---

## 💡 Ideias Ativas — Usuário
### 2026-10 — Extensão com um botão permanente
O pedido original: um botão na página do Projeto (ou no ícone da extensão) que esvazia os arquivos. Encaminhada como forma B, depois da prova em A (DEC-002).

---

## 🤖 Ideias Ativas — Assistente
### 2026-10-20 — Progresso no título da aba
Enquanto remove, trocar o título da aba para «ClearDrop 19/33 — asehub» (e devolver no fim): dá para acompanhar pela barra de tarefas com a janela minimizada. Mexe no título do site; só se o dono quiser.

### 2026-10-20 — Ícone próprio da extensão
Hoje o Chrome mostra uma letra «C» genérica. Um ícone PNG (16/32/48/128) ajuda a achá-lo na barra. Pequeno; entra quando o README ganhar os prints.

### 2026-10-20 — Desligar o ícone fora de um Projeto
Hoje o clique fora do claude.ai só mostra «!» no ícone. Dá para deixar o ícone cinza fora de `/project/` com `declarativeContent`, mas isso pede uma permissão a mais. Só vale se o «!» incomodar.

### 2026-10-19 — Abrir a lista de arquivos sozinho *(feita na 0.2.0 — DEC-006)*
Pergunta do dono: precisa abrir o modal antes? Hoje sim. A ferramenta pode clicar no botão que abre a lista quando o modal não estiver aberto. Falta medir esse botão no layout limbo (no layout novo é «Mostrar contexto»). Entra junto da F2.

### 2026-10-19 — Confirmação por clique na extensão *(feita na 0.2.0 — DEC-006)*
Pergunta do dono: sempre vai ter que digitar o nome do Projeto? No console, digitar é a única barreira, porque o site não confirma. Numa extensão, o próprio clique no botão já é deliberado. Basta uma janela «Remover 6 arquivos de «Canção»?» com Cancelar/Remover, mostrando nome e contagem (requisito 2 da SPEC). Digitar o nome pode ficar como opção. Decide na F2.

### 2026-10-18 — Detectar o layout e recusar no nativo
Ao rodar, se o modal tiver «Selecionar» (layout novo) ou não for o modal «Arquivos», não fazer nada e dizer qual recurso nativo usar. Entra na F1 (DEC-004).

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
- **Bookmarklet do trecho** — preterido pela extensão em 19/10 (DEC-006) — **volta quando** o dono quiser usar o ClearDrop num navegador onde não possa instalar extensão.
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
- **2026-10-17** O prompt de início não previa conferir se a lacuna da interface continuava existindo antes de medir os detalhes. Medição barata que teria economizado a F0: «o botão em lote voltou?». Vale como primeiro passo padrão em projetos que contornam a interface de terceiros.
- **2026-10-20** Duas previsões da wo0004 erraram, e o Code acusou as duas:
  - **(a) Contagem não ancorada.** `grep -c '"version": "0.2.0"' package-lock.json` previu 2 e deu 3, porque uma dependência por coincidência também era 0.2.0. Faltou ancorar a busca no pacote raiz; o molde de WO já pedia isso, e o chat não aplicou.
  - **(b) Caminho removido no `git add`.** A WO mandou `git add src` depois de `git rm src/...`, e o caminho já não existia. Em WO com remoção, o `git add` não lista o que foi removido; o `git rm` já deixou a remoção registrada.
- **2026-10-20** O texto de comando do chat converte `\uXXXX` no caractere antes de chegar ao destino — inclusive na ferramenta de escrita de arquivo. Para o kit: todo código com escapes Unicode gravado pelo assistente precisa de marcador ASCII + troca no destino + conferência por hash, e um teste que acuse o caractere literal.
- **2026-10-19** A frase «Peça no próximo turno» pediu só o resultado do roteiro e esqueceu o da WO pendente («wo0003 aplicada»); o dono notou. Regra: quando houver WO entregue no turno, a frase começa pelo relatório dela, mesmo que outra tarefa venha junto.
- **2026-10-19** Teste com DOM simulado escrito à mão passou e o site real falhou (glifo de ícone no texto do menu). Regra para o kit: fixture de teste sai da medição; e a medição de texto de controle deve imprimir os bytes (ou o rótulo acessível), porque glifo de uso privado é invisível no console e no `cut`.
- **2026-10-18** Levar arquivo do ambiente do chat para o disco por base64 longo (13 KB) corrompeu na transcrição; texto puro conferido por `sha1sum`, e regenerar o derivado no próprio disco, funcionou de primeira. Bom padrão para o kit.
- **2026-10-18** Medir UI efêmera (confirmação) com trecho que roda no instante certo falhou duas vezes; o que funciona é um observador (`MutationObserver`) que roda ANTES da ação manual e registra o que aparecer. Bom padrão para o kit.
- **2026-10-17** Seção «Feedback para o ASU» removida do IDEAS: este projeto não usa o ASU.
