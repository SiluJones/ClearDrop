/**
 * ClearDrop 0.2.1 — esvazia os arquivos de conhecimento do Projeto aberto no claude.ai.
 *
 * Alvo: o layout «limbo» (lista «Arquivos» SEM o botão «Selecionar»). No layout com
 * «Selecionar», a exclusão em lote é nativa e o ClearDrop se recusa a rodar (DEC-004).
 *
 * Duas portas de entrada, o mesmo código (DEC-006):
 *   - Extensão: este arquivo é content script; ui.js chama run() com a janela própria.
 *   - Console: F12 → Console, cole este arquivo inteiro e use
 *       ClearDrop.scan()  — ensaio: abre a lista, confere e lista; NÃO remove nada.
 *       ClearDrop.run()   — remove todos, um a um, depois de você digitar o nome do Projeto.
 *       ClearDrop.stop()  — para depois do arquivo da vez.
 * A lista de arquivos não precisa estar aberta: o ClearDrop a abre (e reabre, se fechar).
 * Rodar run() de novo depois de uma parada continua dos que restaram.
 *
 * O site NÃO pede confirmação ao remover (medido em 2026-10-18): a confirmação deste
 * código é a única proteção. Nada sai do navegador: o código só clica na página.
 * Seletores e rótulos: meta/CONTEXT.md, seção crítica; regras em meta/DECISIONS.md (DEC-003).
 */
(() => {
  'use strict';

  // Âncoras de busca — um lugar só, nomes que dizem o que procuram (DEC-003).
  const SELECTORS = {
    filesModal: '[role="dialog"]',
    filesModalMarker: '[data-testid="project-doc-upload"]',
    listOpener: 'button[data-quiet-row="context"]',
    rowMenuTrigger: 'button[aria-haspopup="menu"]:not([data-testid])',
    openMenu: '[role="menu"][data-open]',
    menuItem: '[role="menuitem"]',
    nativeSelectToggle: 'button[aria-pressed]',
    nativeRegion: '[role="region"]',
    listSpinner: '[role="status"]:has([data-cds="Spinner"])',
    anyDialog: '[role="dialog"],[role="alertdialog"]',
  };

  // Textos CONFERIDOS, nunca usados para achar elemento: mudam com o idioma da interface.
  const LABELS = {
    removeItem: ['Remover do projeto', 'Remove from project'],
    nativeSelect: ['Selecionar', 'Select'],
    footerCount: /(\d+)\s+(?:arquivos?|files?)\b/i,
  };

  // Tempos em ms. Espera por condição, com teto; o ritmo entre remoções é humano, nunca rajada.
  const TIMING = {
    pollMs: 100,
    openMs: 5000,
    menuMs: 3000,
    removeMs: 8000,
    settleQuietMs: 1500,
    settleMaxMs: 20000,
    paceMinMs: 700,
    paceMaxMs: 1400,
  };

  /** Parada prevista: mensagem para o dono, sem pilha. */
  class StopError extends Error {}
  const fail = (message) => { throw new StopError(message); };

  let stopRequested = false;
  let running = false;
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  /**
   * Relógio que só anda com a aba VISÍVEL (FIX-002). Com a janela minimizada ou a aba em
   * segundo plano, o Chrome desacelera a página — e o próprio site, que demora mais para
   * recarregar a lista. Contar esse tempo estourava os tetos e parava a remoção no meio.
   * Um intervalo entre duas leituras só conta se a aba estava visível nas duas pontas, e no
   * máximo 1 s: ao voltar de um minuto oculta, esse minuto não entra de uma vez.
   */
  function visibleClock() {
    let elapsed = 0;
    let last = Date.now();
    let wasVisible = !document.hidden;
    return () => {
      const now = Date.now();
      const visible = !document.hidden;
      if (visible && wasVisible) elapsed += Math.min(now - last, 1000);
      last = now;
      wasVisible = visible;
      return elapsed;
    };
  }

  /** Repete `check()` até devolver algo verdadeiro; devolve esse valor, ou null no teto (tempo visível). */
  async function waitFor(check, timeoutMs) {
    const clock = visibleClock();
    while (clock() < timeoutMs) {
      const value = check();
      if (value) return value;
      await sleep(TIMING.pollMs);
    }
    return null;
  }

  /**
   * Rótulo como a pessoa lê: ignora o que é aria-hidden (os ícones do site são glifos de
   * fonte, ex. U+E101 antes de «Remover do projeto») e, por garantia, caracteres de uso
   * privado soltos. Comparar textContent cru foi o FIX-001.
   */
  function visibleLabel(element) {
    let text = '';
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      if (!walker.currentNode.parentElement.closest('[aria-hidden="true"]')) text += walker.currentNode.nodeValue;
    }
    return text.replace(/[\uE000-\uF8FF]/g, '').replace(/\s+/g, ' ').trim();
  }

  /** A lista de arquivos é o diálogo que contém o botão de upload do Projeto. */
  function findModal() {
    return [...document.querySelectorAll(SELECTORS.filesModal)]
      .find((dialog) => dialog.querySelector(SELECTORS.filesModalMarker)) || null;
  }

  /**
   * Devolve a lista aberta; se estiver fechada, clica no botão que a abre (medido em
   * 2026-10-19: «Mostrar arquivos», data-quiet-row="context") e espera ela aparecer.
   * Também é o conserto para quando a lista fecha no meio — um clique na janela da
   * extensão conta como «clique fora» para o site.
   */
  async function openList() {
    const open = findModal();
    if (open) return open;
    const opener = document.querySelector(SELECTORS.listOpener);
    if (!opener) fail('Não achei o botão que abre a lista de arquivos nesta página.');
    opener.click();
    const modal = await waitFor(findModal, TIMING.openMs);
    if (!modal) fail(`Cliquei em «${visibleLabel(opener) || opener.getAttribute('aria-label') || 'abrir'}», mas a lista não abriu em ${TIMING.openMs} ms.`);
    return modal;
  }

  /** Layout novo = exclusão em lote nativa disponível; o ClearDrop não roda nele. */
  function hasNativeBulk(modal) {
    if (modal.querySelector(SELECTORS.nativeRegion)) return true;
    return [...modal.querySelectorAll(SELECTORS.nativeSelectToggle)]
      .some((button) => LABELS.nativeSelect.includes(visibleLabel(button)));
  }

  /** Nome do Projeto, tirado do título da aba («mapsmith - Claude» → «mapsmith»). */
  function projectName() {
    return document.title.replace(/\s+[-–—]\s+Claude\s*$/, '').trim();
  }

  /** Contagem do rodapé («36 arquivos · 8% ...»); null se ilegível. */
  function footerCount(modal) {
    const match = modal.innerText.match(LABELS.footerCount);
    return match ? Number(match[1]) : null;
  }

  /**
   * Nome do arquivo de uma linha: sobe do botão ⋮ até o primeiro ancestral que tem um <time>
   * (a linha) e lê o aria-label do botão que cobre a linha — o que não abre menu.
   */
  function rowName(trigger) {
    let row = trigger.parentElement;
    while (row && !row.querySelector('time')) row = row.parentElement;
    if (!row) return null;
    const cover = [...row.querySelectorAll('button')]
      .find((button) => !button.hasAttribute('aria-haspopup') && button.getAttribute('aria-label'));
    return cover ? cover.getAttribute('aria-label') : null;
  }

  function listRows(modal) {
    return [...modal.querySelectorAll(SELECTORS.rowMenuTrigger)]
      .map((trigger) => ({ trigger, name: rowName(trigger) }));
  }

  /** Fecha um menu aberto sem escolher nada. */
  function closeMenu(menu) {
    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  }

  /**
   * Espera a lista parar de recarregar: sem spinner por `settleQuietMs` seguidos.
   * Se a lista fechou nesse meio-tempo, reabre e continua esperando. Os dois tempos (o
   * sossego e o teto) só contam com a aba visível — ver visibleClock().
   */
  async function settle() {
    const clock = visibleClock();
    let quietSince = clock();
    while (clock() < TIMING.settleMaxMs) {
      let modal = findModal();
      if (!modal) {
        modal = await openList().catch(() => null);
        quietSince = clock();
      } else if (modal.querySelector(SELECTORS.listSpinner)) {
        quietSince = clock();
      } else if (clock() - quietSince >= TIMING.settleQuietMs) {
        return modal;
      }
      await sleep(TIMING.pollMs);
    }
    return null;
  }

  /**
   * Abre a lista se preciso e confere tudo antes de agir; devolve o estado da tela ou para
   * com mensagem. `empty` = o Projeto não tem arquivos (rodapé zerado ou ausente, e 0 linhas).
   */
  async function preflight() {
    if (!/^\/project\//.test(location.pathname)) fail('Esta aba não é a página de um Projeto (claude.ai/project/...).');
    const modal = await openList();
    if (hasNativeBulk(modal)) {
      fail('Este Projeto já tem «Selecionar» (exclusão em lote nativa). Use: Selecionar → Selecionar tudo → Excluir.');
    }
    const project = projectName();
    if (!project) fail('Não li o nome do Projeto no título da aba.');
    const rows = listRows(modal);
    const unnamed = rows.filter((row) => !row.name).length;
    if (unnamed) fail(`${unnamed} linha(s) sem nome legível: o layout mudou.`);
    const footer = footerCount(modal);
    if (footer === null && rows.length === 0) return { modal, rows, footer: 0, project, empty: true };
    if (footer === null) fail('Não li a contagem do rodapé («N arquivos»).');
    if (footer !== rows.length) fail(`O rodapé diz ${footer} e a lista tem ${rows.length} linhas.`);
    return { modal, rows, footer, project, empty: footer === 0 };
  }

  /** Confirmação do Console: digitar o nome do Projeto (no Console não há outra barreira). */
  async function confirmByTypedName(state) {
    console.table(state.rows.map((row) => ({ arquivo: row.name })));
    const typed = prompt(
      `ClearDrop vai remover ${state.footer} arquivo(s) do Projeto «${state.project}» (lista no console).\n` +
      'Não há como desfazer, e o site não pede confirmação.\n\nDigite o nome do Projeto para confirmar:'
    );
    return typed !== null && typed.trim() === state.project;
  }

  /** Aviso do Console: alerta, e também no console. */
  function alertNotify(result) {
    (result.status === 'error' ? console.error : console.log)(result.message);
    if (result.status !== 'cancelled') alert(result.message);
  }

  /** Monta o resultado de uma parada, com o progresso quando houver. */
  function stopResult(error, progress) {
    const known = error instanceof StopError;
    if (!known) console.error(error);
    let message = `ClearDrop parou: ${known ? error.message : `erro inesperado — ${error && error.message}`}`;
    if (progress) {
      message += `\nRemovidos ${progress.removed} de ${progress.total}; restam ${progress.total - progress.removed}.`;
      if (progress.current) message += ` Parou em «${progress.current}».`;
      message += ' Rodar de novo continua dos que restaram.';
    } else {
      message += '\nNada foi removido.';
    }
    return { status: 'error', message, removed: progress ? progress.removed : 0, total: progress ? progress.total : 0 };
  }

  /** Ensaio: abre a lista, confere e lista, sem remover. Devolve os nomes, ou null se parou. */
  async function scan() {
    try {
      const state = await preflight();
      console.log(`ClearDrop — ensaio: ${state.footer} arquivo(s) no Projeto «${state.project}». Nada foi removido.`);
      console.table(state.rows.map((row) => ({ arquivo: row.name })));
      return state.rows.map((row) => row.name);
    } catch (error) {
      alertNotify(stopResult(error));
      return null;
    }
  }

  /** Remove um arquivo pelo nome; confere menu, sumiço, assentamento e rodapé. */
  async function removeOne(name) {
    const modal = await openList();
    if (hasNativeBulk(modal)) fail('O layout mudou para o com «Selecionar».');
    const before = footerCount(modal);
    if (before === null) fail('Não li a contagem do rodapé.');
    const row = listRows(modal).find((candidate) => candidate.name === name);
    if (!row) fail(`«${name}» não está mais na lista.`);

    row.trigger.click();
    const menu = await waitFor(() => document.querySelector(SELECTORS.openMenu), TIMING.menuMs);
    if (!menu) fail(`O menu de «${name}» não abriu em ${TIMING.menuMs} ms.`);
    const items = [...menu.querySelectorAll(SELECTORS.menuItem)];
    const labels = items.map(visibleLabel);
    if (items.length !== 1 || !LABELS.removeItem.includes(labels[0])) {
      closeMenu(menu);
      fail(`O menu de «${name}» não é o esperado: ${labels.map((l) => `«${l}»`).join(', ') || 'sem itens'}.`);
    }

    // Um diálogo novo aqui seria uma confirmação que o site não tinha: para, não clica às cegas.
    const dialogsBefore = document.querySelectorAll(SELECTORS.anyDialog).length;
    items[0].click();
    const outcome = await waitFor(() => {
      if (document.querySelectorAll(SELECTORS.anyDialog).length > dialogsBefore) return 'dialog';
      const current = findModal();
      if (current && !listRows(current).some((candidate) => candidate.name === name)) return 'gone';
      return null;
    }, TIMING.removeMs);
    if (outcome === 'dialog') fail(`Apareceu um diálogo inesperado ao remover «${name}» (o site não pedia confirmação). Resolva-o à mão.`);
    if (!outcome) fail(`«${name}» não sumiu da lista em ${TIMING.removeMs} ms.`);

    // A lista recarrega depois de remover (spinner «Carregando...»): só confere depois de assentar.
    const settled = await settle();
    if (!settled) fail(`A lista não terminou de recarregar em ${TIMING.settleMaxMs} ms depois de «${name}».`);
    if (listRows(settled).some((candidate) => candidate.name === name)) fail(`«${name}» voltou à lista depois de recarregar.`);
    const after = footerCount(settled);
    if (after !== before - 1) fail(`O rodapé foi de ${before} para ${after} ao remover «${name}» (esperado ${before - 1}).`);
  }

  /**
   * Remove todos os arquivos do Projeto aberto, após confirmação.
   * options.confirm(state) → Promise<boolean>  — padrão: digitar o nome (Console).
   * options.onProgress({ removed, total, name }) — chamado a cada arquivo removido.
   * options.notify(result)                      — padrão: alerta (Console).
   * Devolve { status: 'done'|'empty'|'cancelled'|'error'|'busy', message, removed, total }.
   */
  async function run(options = {}) {
    const confirm = options.confirm || confirmByTypedName;
    const onProgress = options.onProgress || (() => {});
    const notify = options.notify || alertNotify;
    if (running) return { status: 'busy', message: 'O ClearDrop já está rodando nesta aba.', removed: 0, total: 0 };
    running = true;
    stopRequested = false;
    let result;
    try {
      let state;
      try {
        state = await preflight();
      } catch (error) {
        result = stopResult(error);
        return result;
      }
      if (state.empty) {
        result = { status: 'empty', message: `O Projeto «${state.project}» já está sem arquivos.`, removed: 0, total: 0 };
        return result;
      }
      if (!(await confirm(state))) {
        result = { status: 'cancelled', message: 'ClearDrop: cancelado — nada foi removido.', removed: 0, total: state.footer };
        return result;
      }
      const names = state.rows.map((row) => row.name);
      const progress = { removed: 0, total: names.length, current: null };
      try {
        for (const name of names) {
          if (stopRequested) fail('Parado a pedido.');
          progress.current = name;
          await removeOne(name);
          progress.removed += 1;
          progress.current = null; // «Parou em» só nomeia o arquivo cuja remoção falhou.
          console.log(`ClearDrop [${progress.removed}/${progress.total}] removido: ${name}`);
          onProgress({ removed: progress.removed, total: progress.total, name });
          await sleep(TIMING.paceMinMs + Math.random() * (TIMING.paceMaxMs - TIMING.paceMinMs));
        }
        result = {
          status: 'done',
          message: `ClearDrop: ${progress.removed} arquivo(s) removido(s) do Projeto «${state.project}».`,
          removed: progress.removed,
          total: progress.total,
        };
      } catch (error) {
        result = stopResult(error, progress);
      }
      return result;
    } finally {
      running = false;
      if (result) notify(result);
    }
  }

  /** Pede para parar depois do arquivo da vez. */
  function stop() {
    stopRequested = true;
    console.log('ClearDrop: vai parar depois do arquivo da vez.');
  }

  window.ClearDrop = { version: '0.2.1', scan, run, stop, SELECTORS, LABELS, TIMING };
  console.log('ClearDrop 0.2.1 carregado. ClearDrop.scan() = ensaio · ClearDrop.run() = remover tudo · ClearDrop.stop() = parar.');
})();
