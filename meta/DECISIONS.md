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
**Data:** 2026-10-17 · **Status:** aceita, revisável após a medição do menu (F0)

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
