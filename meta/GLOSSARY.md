# GLOSSARY.md — Termos do Projeto

---

## Conceitos do projeto
- **Projeto** — um Projeto do claude.ai (com Instruções, conversas e arquivos de conhecimento). Não confundir com «o projeto ClearDrop».
- **Arquivos de conhecimento** — os arquivos anexados ao Projeto, listados no modal «Arquivos». Único alvo do ClearDrop.
- **Esvaziar** — excluir todos os arquivos de conhecimento do Projeto aberto, e nada mais.
- **Cobaia** — arquivo descartável (`teste-cleardrop.txt`) usado para testar exclusão sem risco.
- **Modo ensaio** — execução que lista e conta, sem excluir.

## Interface medida (claude.ai)
- **Modal «Arquivos»** — o diálogo que lista os arquivos do Projeto (nome, tipo, tamanho, data, lupa, Adicionar).
- **Menu ⋮ / «Mais opções»** — o botão por linha (`aria-label="Mais opções para <arquivo>"`) que abre as ações do arquivo.
- **CDS / Base UI** — o design system da página e a biblioteca de componentes por baixo; explicam os ids `base-ui-_r_…_` e os atributos `data-cds`.
- **Casca da página** — o HTML de carregamento que o «código-fonte» mostra; não contém o modal.
- **DOM renderizado** — a página como está na tela depois do JavaScript; é o que se mede.
- **Lista virtualizada** — lista que só desenha as linhas visíveis; obriga a rolar para alcançar as demais.

## Formas de solução
- **Forma A** — trecho no console (DevTools) ou bookmarklet.
- **Forma B** — extensão do Chrome Manifest V3.
- **Forma C** — userscript. **D** — repetir a requisição interna. **E** — Projeto novo. **F** — Claude in Chrome clicando.

## Extensão
- **Ícone do ClearDrop** — o botão na barra do Chrome (`action`) que dispara tudo; nada roda sem ele.
- **Janela do ClearDrop** — a confirmação/progresso/resultado desenhada pela extensão sobre a página, em Shadow DOM (`<cleardrop-ui>`).
- **«Mostrar arquivos»** — o botão da página do Projeto que abre a lista (`data-quiet-row="context"`); o ClearDrop o usa para abrir e reabrir a lista.
- **Clique fora** — clique fora da lista do site, que pode fechá-la; a janela segura o pointerdown e o núcleo reabre a lista.

## Comandos / artefatos
- **FlatDrop** — ferramenta-irmã: achata o repositório e sobe ao Projeto.
- **KCM** — Kit de Contexto Universal, que gerou os meta/ e as Instruções.
- **WO** — ordem de trabalho do chat para o Claude Code (`meta/workorders/AAMMDD-woNNNN-desc.md`), aplicada com `/apply-wo`.
- **`SELECTORS`** — o objeto único onde moram todos os seletores (DEC-003).
