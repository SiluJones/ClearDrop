# HISTORY.md — Conhecimento Consolidado

> Lido sob demanda. Guarda o que já foi aprendido e não muda mais.

---

## 1. Como medir uma interface desenhada por JavaScript (2026-10-17)
- **O que não funciona:** «Exibir código-fonte» (Ctrl+U) e «Salvar página» (Ctrl+S) devolvem a **casca** do app — compositor e scripts de boot. No claude.ai, nenhum rótulo de excluir, nenhuma linha de arquivo. Dois arquivos assim foram gerados no primeiro dia (`261016-1524.txt`, `261017-0702.txt`, hoje em `../referencia/`).
- **O que funciona para elementos estáveis:** DevTools → botão direito no elemento → *Copiar* → *Copiar outerHTML*, com o elemento aberto na tela. Assim saiu o `261017-0707.html` (modal «Arquivos»).
- **O que funciona para elementos efêmeros** (menu ⋮, popover, tooltip): um trecho de console que abre o elemento, captura `outerHTML`, fecha e baixa o resultado como arquivo. Clicar no DevTools tira o foco da página e o menu fecha antes de ser copiado. Modelo: `../261017-GUIA-MEDIR-MENU.md`.
- **Chrome bloqueia colar no console na primeira vez:** digitar `permitir colar` (ou `allow pasting`).
- **Rede:** para estudar a requisição de uma ação, só método, caminho e status em captura de tela. HAR e cabeçalhos carregam cookie e token — nunca na pasta.

## 2. O caso de origem (2026-10-17)
Até out/2026 o painel «Contexto» do Projeto tinha caixa de seleção por arquivo, «N selecionado» e uma lixeira que apagava todos (captura `Captura de tela 2026-09-30 161640.png`). A atualização de layout trocou isso pelo modal «Arquivos» com menu ⋮ por linha e sem ação em lote, também nas contas gratuitas (`Captura de tela 2026-10-16 152405.png`, 38 arquivos, conta Free). O dono mandou feedback à Anthropic, sem resposta. O prompt de início completo está em `../notas-arquivadas/261017-PROMPT-DE-INICIO.md`.

## 3. A exclusão em lote voltou no mesmo dia (2026-10-17)
De manhã, o modal «Arquivos» (35 arquivos) não tinha seleção. À noite, no Projeto *mapsmith* (conta Pro, 173 arquivos), o modal se chamava «Contexto» e tinha «Selecionar» → «Selecionar tudo» → «Excluir N itens selecionados». A F0 terminou provando que o problema de origem tinha sido resolvido pela própria Anthropic, ao menos no plano Pro. Lição: em ferramenta que contorna uma lacuna da interface de outro, a primeira medição de cada sessão é «a lacuna ainda existe?».
