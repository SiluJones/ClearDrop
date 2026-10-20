# DECISIONS.md — Registro de Decisões

> Cresce devagar. Guarda o PORQUÊ. **DEC** = arquitetura/design; **FIX** = bug grave resolvido.
> Não reescreva entradas antigas: decisão substituída vira «SUPERADA por DEC-N».

---

## DEC-001 — Nome: ClearDrop
**Data:** 2026-10-17 · **Status:** aceita

### Contexto
O prompt de início sugeriu cinco nomes; a pasta e o repositório já foram criados como `ClearDrop`.

### Decisão
O projeto se chama **ClearDrop** (repositório `cleardrop`/`ClearDrop`), irmão do FlatDrop.

### Alternativas consideradas
- **ProjectSweep / KnowledgeWipe** — neutros e bons para loja, mas perdem o par com o FlatDrop.
- **Faxina / Rodo** — curtos em PT, mas sem par e ruins se publicar.

### Consequências
Os placeholders `[NOME]`/`projeto` do kit viram ClearDrop (README, Instruções, CLAUDE.md).

---

## DEC-002 — Sequência de formas: A prova, B empacota, D depois
**Data:** 2026-10-17 · **Status:** SUPERADA por DEC-004

### Contexto
O dono sugeriu uma extensão; o prompt listou seis formas (A console, B extensão MV3, C userscript, D requisição interna, E Projeto novo, F Claude in Chrome). Nada do menu ⋮ foi medido ainda.

### Decisão
Provar o fluxo como **trecho de console (A)** na tela real e, funcionando, empacotar **o mesmo núcleo** como **extensão MV3 carregada sem compactação (B)**. **D** só como estudo de robustez, depois, e só a partir do que a aba Rede mostrar (nunca chutando o formato).

### Alternativas consideradas
- **B direto** — mais peças (manifesto, permissões, recarregar a extensão) a cada ajuste de seletor enquanto a página ainda é desconhecida.
- **C userscript** — exige outra extensão instalada; não ganha nada sobre B para o dono.
- **D primeiro** — interface interna não documentada, termos de uso a ler, e erro de formato pode excluir o que não devia sem tela para conferir.
- **E Projeto novo** — perde o histórico de conversas; não é o que o dono quer.
- **F Claude in Chrome** — lento, gasta uso, é o trabalho repetitivo que a ferramenta deveria fazer.

### Consequências
O núcleo é uma função independente de como é injetada (console ou content script). Mudança de layout quebra A e B juntas — por isso DEC-003.

---

## DEC-003 — Seletores por ARIA e estrutura, centralizados
**Data:** 2026-10-17 · **Status:** aceita

### Contexto
A medição do modal (`261017-0707.html`) mostrou classes utilitárias (Tailwind) e ids gerados (`base-ui-_r_7i_`), e rótulos traduzidos para pt-BR («Mais opções para X», «35 arquivos»).

### Decisão
Âncoras em ordem de preferência: `data-testid` → `role`/`aria-haspopup`/`aria-expanded` → estrutura relativa (o botão de menu dentro do modal) → texto, só onde não houver alternativa. Todos num objeto `SELECTORS` único, com nomes que digam o que procuram, e cada falha de busca gera mensagem que nomeia o seletor e o arquivo da vez.

### Alternativas consideradas
- **Texto visível** — quebra com outro idioma de interface.
- **Classes/ids** — mudam a cada build da página.

### Consequências
O modal se identifica por `[role="dialog"]` que contenha `[data-testid="project-doc-upload"]`; o botão ⋮ de cada linha por `button[aria-haspopup="menu"]:not([data-testid])`. O item Excluir e a confirmação ainda podem exigir texto — a decidir quando medidos.

---

## DEC-004 — Seguir só para o layout «limbo», em trecho de console
**Data:** 2026-10-18 · **Status:** aceita

### Contexto
A F0 (`meta/analises/261017-ANALISE-forma-e-seletores.md`) achou a exclusão em lote nativa de volta no plano Pro. O dono confirmou três estados de interface, um por conta:
1. **Interface antiga** (cartões com seleção em massa): exclusão em lote nativa.
2. **Layout «limbo»** (modal «Arquivos», sem «Selecionar»): exclusão só arquivo por arquivo. É o estado da conta Free medida.
3. **Layout novo** (modal «Contexto» com «Selecionar»): exclusão em lote nativa. É o estado das contas pagas.

### Decisão
O ClearDrop segue **apenas para o layout «limbo»**, pelo caminho por linha (⋮ → «Remover do projeto»), entregue como **trecho de console (forma A)**. Ao abrir, ele detecta o botão «Selecionar»: se existir, não faz nada e manda usar o recurso nativo. A extensão (forma B) só volta se o limbo durar.

### Alternativas consideradas
- **Encerrar agora** — a conta Free do dono ficaria presa ao clique por arquivo enquanto a migração dela não chega.
- **Extensão MV3** — custo de empacotar e manter para uma ferramenta cuja vida útil acaba quando a migração terminar.
- **Automatizar também o recurso nativo** — economiza três cliques; não paga a manutenção.

### Consequências
O projeto tem prazo de validade embutido: perde a razão de existir quando a última conta sair do limbo. O código precisa ser pequeno, num arquivo só, e falhar alto. A confirmação de remoção ainda não foi medida: o trecho, ao remover, para se aparecer qualquer diálogo inesperado.

---

## DEC-005 — Testes em jsdom sobre o modal real, como dependência só de desenvolvimento
**Data:** 2026-10-18 · **Status:** aceita

### Contexto
O trecho remove arquivos sem confirmação do site, e testar no claude.ai é irreversível. O requisito 7 proíbe dependência pesada na ferramenta.

### Decisão
- **O código:** `src/cleardrop.js` continua sem dependência nenhuma.
- **Os testes:** `tests/cleardrop.test.js` usa **jsdom 24.1.3** (devDependency fixada) para montar o outerHTML real do modal limbo (`tests/fixtures/modal-limbo.html`, derivado do `261017-0707.html` sem classes, estilos e SVG).
- **O "site" simulado:** reage como o medido — menu ⋮ com um item, remoção sem confirmação, recarga com spinner.
- **Validação:** `npm test`.

### Alternativas consideradas
- **Só teste manual** — cada erro custaria arquivos de verdade.
- **Playwright contra o claude.ai** — sessão real, termos de uso, e exclusão real; desproporcional.

### Consequências
O teste prova a lógica contra a estrutura medida, não contra o site vivo: mudança de layout só aparece no roteiro manual ou no uso. O fixture precisa ser regenerado quando o layout limbo mudar.

---

## FIX-001 — Item «Remover do projeto» recusado por causa do glifo do ícone
**Data:** 2026-10-19

- **Sintoma:** no primeiro uso real (conta Free, Projeto «Canção», 7 arquivos), `run()` parou no primeiro arquivo com «O menu de «X» não é o esperado: «Remover do projeto»» — o rótulo exibido era o esperado. Nada foi removido.
- **Causa raiz:** o item de menu traz, antes do texto, um `<span data-cds="Icon" aria-hidden="true">` cujo conteúdo é o glifo de fonte `U+E101` (uso privado, invisível no console). O código comparava `textContent.trim()`, que inclui o glifo. O byte estava na medição de 17/10 (`EE 84 81` antes de «Remover»), mas o teste usava um menu escrito à mão, sem ícone, e passou.
- **Solução:** `visibleLabel()` lê só o texto fora de `[aria-hidden="true"]` e remove caracteres de uso privado soltos; usada no item do menu e no botão «Selecionar». O teste passa a montar o menu a partir do outerHTML MEDIDO (`tests/fixtures/menu-limbo.html`, com o glifo). Contraprova: o código antigo com o fixture novo falha com a mesma mensagem do uso real.
- **Lição:** fixture de teste sai da medição, nunca de memória; texto de controle se compara pelo rótulo acessível, não por `textContent`. Virou a armadilha 9 do CONTEXT.

---

## DEC-006 — F2: extensão MV3, confirmação por clique, abre a lista sozinha
**Data:** 2026-10-19, ajustada em 2026-10-20 · **Status:** aceita (escolha do dono; desenho técnico do chat)

### Contexto
O 0.1.1 funciona no site real, mas exige colar no Console, abrir a lista antes e digitar o nome do Projeto. O dono escolheu: extensão, confirmação por clique e abrir a lista sozinha. Reabre o que DEC-004 tinha adiado.

### Decisão
1. **Gatilho:** **ícone da extensão na barra do Chrome** (`action`). O service worker manda uma mensagem à aba, e o content script roda. Nada é desenhado na página antes do clique; não roda sozinho ao abrir a página.
2. **Escopo:** content script em `https://claude.ai/*`, e o código só age se a URL for `/project/...` *(ajustado em 20/10, antes do commit: o claude.ai troca de página sem recarregar, e um content script restrito a `/project/*` não seria injetado quando se entra no Projeto vindo da tela inicial)*. **Sem permissões além disso:** nada de `tabs`, `storage` ou acesso à rede. Nada sai do navegador (requisito 6).
3. **Confirmação:** janela própria da extensão sobre a página (em Shadow DOM, para não brigar com o CSS do site). Ela mostra o nome do Projeto, a contagem e a lista, com **Cancelar / Remover**. A mesma janela mostra o progresso, um botão **Parar** e o resultado final. O `prompt`/`alert` só fica no uso por Console.
4. **Abrir a lista:** se a lista estiver fechada, a extensão clica no botão que a abre e espera ela aparecer. O seletor desse botão só entra depois da medição (`../261019-GUIA-MEDIR-ABRIR-LISTA.md`), nunca de memória.
5. **Um núcleo só:** `extension/cleardrop.js` é o mesmo código para o Console e para a extensão *(ajustado em 20/10: ele sai de `src/` porque o Chrome só carrega arquivos de dentro da pasta da extensão, e a pasta da extensão não pode ser a raiz do repositório — o Chrome recusa extensão com arquivos começando com `_`, como os `_TEMPLATE.md`)*. `run()` aceita funções de confirmação, progresso e aviso; sem elas, usa `prompt`/`alert`, como antes.
6. **Instalação:** «Carregar sem compactação» apontando para a pasta `extension/`. Sem loja (DEC-004 e IDEAS).

### Alternativas consideradas
- **Botão desenhado dentro da página** — sempre visível, mas mexe no layout do site e precisa de outro seletor de ancoragem, que quebra a cada mudança. O ícone não depende do layout.
- **Popup da extensão com o botão** — um clique a mais, e o popup fecha ao perder o foco, perdendo o progresso.
- **`window.confirm` como confirmação** — não mostra a lista nem o progresso, e bloqueia a página.
- **Bookmarklet** — mais simples, mas o CSP do site pode bloquear, e não melhora a confirmação.

### Consequências
- Mais peças: `manifest.json`, service worker, interface. O núcleo continua testável em jsdom.
- A interface da janela também precisa de teste.
- O ícone pode ficar escondido no menu de extensões do Chrome: o roteiro manda fixá-lo.

---

## FIX-002 — Remoção parava com a janela minimizada
**Data:** 2026-10-20

- **Sintoma:** no Projeto «asehub» (33 arquivos, conta Free), com a janela minimizada, a extensão parou depois de 19 com «A lista não terminou de recarregar em 20000 ms depois de «IDEAS__template-update.md»». A parada foi segura: disse quantos restavam e onde parou.
- **Causa raiz:** os tetos de espera (`waitFor`, `settle`) eram medidos em tempo de relógio. Com a aba oculta, o Chrome desacelera a página. Os temporizadores ficam limitados, e depois de alguns minutos ocultos ficam bem mais espaçados. O próprio site também demora mais para terminar a recarga da lista. Os 20 s passavam sem que a lista tivesse chance de assentar.
- **Solução:** `visibleClock()`, um relógio que só anda com a aba visível; `waitFor` e `settle` medem por ele. O intervalo entre duas leituras só conta se a aba estava visível nas duas pontas, e no máximo 1 s, para que voltar de um minuto oculta não estoure o teto de uma vez. Oculta, a remoção não para; só fica mais lenta, como o navegador decide.
- **Prova:** caso 11c (a recarga trava enquanto oculta, por mais que o teto) e 11e (o relógio salta 60 s na volta). O relógio de parede reproduz a mensagem do asehub e derruba os dois; contar o intervalo ao voltar derruba o 11e.
- **Lição:** em automação de página, tempo de espera é «tempo visível», não «tempo de parede». Virou a armadilha 12 do CONTEXT.
