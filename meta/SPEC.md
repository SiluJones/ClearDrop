# SPEC — Esvaziar os arquivos do Projeto aberto

> Spec da feature central do ClearDrop (v0.1). Diz **o que** construir e **quando está pronto**; como aplicar vai por WO.

## Problema
Desde a mudança de layout de out/2026, o modal «Arquivos» de um Projeto do claude.ai só permite excluir arquivo por arquivo (⋮ → Excluir → confirmar). Para quem esvazia Projetos de 35–123 arquivos a cada ciclo de atualização, isso são dezenas de cliques e espaço para erro (excluir no Projeto errado, parar no meio sem saber onde).

## Critérios de aceite (verificáveis)
- [ ] Com o modal «Arquivos» aberto, um comando/botão mostra o **nome do Projeto** e a **contagem** de arquivos, e lista os nomes antes de agir.
- [ ] Nada é excluído sem uma confirmação explícita depois dessa lista.
- [ ] A contagem listada bate com o rodapé do modal («N arquivos»); se não bater, não começa e diz os dois números.
- [ ] Após a confirmação, todos os arquivos listados saem e o rodapé termina em 0; nada mais muda (conversas, Instruções e outros Projetos intactos).
- [ ] Entre exclusões há uma pausa curta (ritmo humano), e cada passo espera o elemento existir em vez de esperar tempo fixo.
- [ ] Se o menu, o item Excluir ou a confirmação não aparecerem dentro do teto de espera, para e informa: arquivo em que parou, quantos saíram, quantos ficaram.
- [ ] Rodar de novo depois de uma parada continua do ponto (só os que restaram), sem efeito colateral.
- [ ] Funciona em conta gratuita.
- [ ] Nenhuma requisição de rede nova além das que a própria página faz ao excluir (conferível na aba Rede).
- [ ] Não roda sozinho ao abrir a página.

## Decisões de design
- Forma A primeiro (trecho de console) para provar na tela real; depois forma B (extensão MV3) com o mesmo núcleo — DEC-002.
- Seletores centralizados, ancorados em ARIA/estrutura — DEC-003.
- Escopo pelo modal: só o que está dentro do diálogo identificado por `[data-testid="project-doc-upload"]`.

## Fora de escopo
- Excluir uma seleção parcial de arquivos (vai para o IDEAS).
- Repetir a chamada interna da API em vez de clicar (forma D) — estudo posterior.
- Subir arquivos (é o FlatDrop).
- Publicação em loja.

## Passos
1. Medir o menu ⋮ e a confirmação (`../261017-GUIA-MEDIR-MENU.md`) e o comportamento com 123 arquivos.
2. Escrever a análise da forma e dos seletores (`meta/analises/`).
3. Trecho de console: listar + confirmar, sem excluir (modo ensaio).
4. Trecho de console: excluir um arquivo-cobaia com todas as paradas de segurança.
5. Trecho de console: esvaziar um Projeto descartável inteiro.
6. Empacotar como extensão MV3 (botão na página ou no ícone).
