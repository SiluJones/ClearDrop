# CONTEXT.md — ClearDrop

> Arquivo **estável**. Descreve o que o projeto É; o agora mora no STATUS.

---

## Visão Geral
ClearDrop é uma ferramenta de navegador que **exclui de uma vez todos — e apenas — os arquivos de conhecimento do Projeto do claude.ai aberto na tela**. Existe porque a atualização de layout de out/2026 tirou do painel o «selecionar todos + lixeira» (também nas contas gratuitas): hoje esvaziar um Projeto de 38 ou 123 arquivos são dezenas de cliques (⋮ → Excluir → confirmar, por arquivo). É a ferramenta-irmã do **FlatDrop**: um achata o repositório e sobe; o ClearDrop esvazia antes de subir.

## Stack Tecnológica
- **Linguagem:** JavaScript vanilla, sem dependência e sem build.
- **Entrega planejada:** primeiro trecho de console (forma A, prova); depois extensão do Chrome Manifest V3 carregada sem compactação (forma B). Ver DEC-002.
- **Persistência:** nenhuma. Nada sai do navegador.
- **Testes:** manuais, num Projeto descartável com arquivos-cobaia (não há harness ainda).
- **Deploy:** nenhum — arquivo único / pasta da extensão distribuídos pelo dono.

## Estrutura do Projeto
```
ClearDrop/                      # pasta-pai, FORA do Git: notas, medições, capturas
├── 261017-GUIA-MEDIR-MENU.md   # como medir o menu ⋮ e a confirmação (F0)
├── 261017-0707.html            # outerHTML do modal «Arquivos» (medição 1)
├── referencia/                 # cascas de página salvas (não ler; não mirar seletor nelas)
└── ClearDrop/                  # o repositório
    ├── INSTRUCOES-DO-PROJETO.md
    ├── CLAUDE.md, .claude/     # arranque do Claude Code (apply-wo, wrap, sondar)
    ├── meta/                   # contexto (CEREBRO, CONTEXT, STATUS...); workorders/; analises/ nasce no 1º uso
    └── logs/                   # diário, um arquivo por dia
```
O código (`src/` ou `extension/`) ainda não existe: nasce na F1.

## Convenções de Código
- **Nomes:** arquivos, funções e variáveis em inglês, camelCase.
- **Comentários:** PT-BR; docstring (JSDoc curto) em função pública.
- **Commits:** PT-BR, imperativo curto, sem acento (CMD do Windows).
- **Estilo:** legibilidade primeiro; sem linter configurado ainda.
- **Seletores:** todos num objeto único (`SELECTORS`), cada um com nome que diz o que procura. Ver DEC-003.

## Como o modal «Arquivos» é feito (CRÍTICO)
Medido em 2026-10-17 sobre `261017-0707.html` (outerHTML real, Projeto com 35 arquivos, interface em pt-BR). Design system próprio (CDS) sobre **Base UI**; classes são utilitárias (Tailwind) e ids são gerados (`base-ui-_r_7i_`) — **nenhum dos dois serve de âncora**.

- **O modal:** `div[role="dialog"]` com `aria-labelledby` apontando para um `h2` «Arquivos». O que o identifica sem depender do idioma: contém `[data-testid="project-doc-upload"]` (o botão Adicionar; o menu dele é `[data-testid="project-doc-uploader-dropdown-trigger"]`).
- **Cada linha:** um `div` com um `button` cobrindo a linha (`aria-label` = nome do arquivo com extensão, ex. `CEREBRO.md`), o nome exibido, um `<time datetime="...">`, e o botão do menu.
- **Menu por linha:** `button[aria-haspopup="menu"]` com `aria-label="Mais opções para <arquivo>"` e `aria-expanded`. Há **um a mais** no modal: o do Adicionar — excluí-lo por `:not([data-testid])`.
- **Contagem de referência:** o rodapé diz «35 arquivos · 8% da capacidade do projeto usada» (há um `role="meter"` com `aria-valuenow`). Com 35, havia 35 linhas no DOM: **sem virtualização nesse tamanho**. Com 123, ainda não medido.
- **Menu ⋮ (medido em 17/10, 174 arquivos):** abre com `.click()`; `[role="menu"]` com **um único** `[role="menuitem"]`, «Remover do projeto»; o Escape fecha. A lista rola, mas **não é virtualizada** até 174.
- **Layout novo, à noite de 17/10, conta Pro:** o título virou «Contexto», há `role="region"` «Arquivos de contexto» e um botão **«Selecionar»** (`aria-pressed`). Com ele ligado aparecem a caixa «Selecionar tudo» (primeiro `role="checkbox"`), uma caixa por linha, «N selecionado» e `button[aria-label^="Excluir"]` («Excluir 173 itens selecionados»). **A exclusão em lote nativa voltou** — ver a análise `meta/analises/261017-ANALISE-forma-e-seletores.md`.
- **Não medido:** se a conta gratuita tem «Selecionar»; se a exclusão (por linha ou em lote) pede confirmação.

## Arquitetura — pontos-chave
- Forma A (console) prova; forma B (extensão MV3) empacota o mesmo código; forma D (repetir a requisição interna) só depois, e só observada — ver DEC-002.
- Seletores por estrutura e ARIA, nunca por classe, id gerado ou texto localizado quando houver alternativa — ver DEC-003.
- Fluxo obrigatório: identificar Projeto → contar e listar → confirmar → excluir um a um em ritmo humano, esperando cada elemento existir → conferir contagem a cada passo → parar no estranho dizendo onde parou.

## Armadilhas Conhecidas (o que NÃO fazer)
1. **Ler o código-fonte da página** (Ctrl+U / Ctrl+S) para achar seletor — é só a casca do app; o modal é desenhado depois. → Medir o DOM renderizado (outerHTML com o modal aberto, ou trecho de console).
2. **Copiar o menu ⋮ pelo DevTools à mão** — ele fecha quando o foco vai para o DevTools. → Trecho de console que abre, copia e fecha.
3. **Ancorar em texto** («Mais opções para», «Excluir», «arquivos») — muda com o idioma da interface. → Estrutura/ARIA primeiro; texto só onde não houver alternativa, e então centralizado e trocável.
4. **Ancorar em classe ou id** (`group/frow`, `base-ui-_r_7c_`) — utilitárias e geradas; mudam a cada build. → `role`, `aria-*`, `data-testid`.
5. **Esperar tempo fixo** entre cliques — animação e render variam. → Esperar o elemento existir (com teto) e falhar alto ao estourar.
6. **Testar exclusão em Projeto real** — é irreversível. → Projeto descartável com arquivos-cobaia.
7. **Salvar HAR ou cabeçalhos** da aba Rede na pasta — carregam cookie e token. → Só método, caminho e status, em captura de tela.
8. **Esperar «Excluir» no menu** — o item se chama «Remover do projeto», e o layout muda sem aviso (dois layouts num mesmo dia). → Medir de novo antes de codar, nunca seletor de memória.

## 📁 Arquivos Críticos (não mexer sem contexto)
- `../261017-0707.html` — a única medição real do modal; base de todos os seletores atuais.
- `meta/CEREBRO.md` — comportamento do assistente; a seção «Técnicas específicas» é deste projeto.

## Contexto de Produto
- **Usuário-alvo:** o dono (vários Projetos no claude.ai, inclusive contas gratuitas, ciclo esvaziar → subir versão nova pelo FlatDrop). Talvez outros, se publicado.
- **Dor que resolve:** esvaziar um Projeto virou dezenas de cliques repetitivos.
- **O que é sucesso:** um botão esvazia o Projeto aberto, mostrando antes o que vai sair, sem tocar em mais nada, e para com mensagem clara quando a tela não é a esperada.
- **Requisitos, em ordem:** (1) escopo exato — só arquivos de conhecimento do Projeto na tela; (2) mostrar e confirmar antes; (3) parar no estranho; (4) funcionar em conta gratuita; (5) sobreviver ou falhar alto à próxima mudança de layout; (6) nada sai do navegador; (7) sem dependência pesada.
- **O que deliberadamente NÃO é:** não contorna limite de conta, não automatiza uso do Claude, não toca conversas, Instruções nem outro Projeto, não roda sozinho ao abrir a página, não dispara em rajada.
