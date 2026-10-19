/**
 * ClearDrop 0.1.1 — esvazia os arquivos de conhecimento do Projeto aberto no claude.ai.
 *
 * Alvo: o layout «limbo» (modal «Arquivos» SEM o botão «Selecionar»). No layout com
 * «Selecionar», a exclusão em lote é nativa e o ClearDrop se recusa a rodar (DEC-004).
 *
 * Uso: abra a lista de arquivos do Projeto, F12 → Console, cole este arquivo inteiro e:
 *   ClearDrop.scan()  — ensaio: lista e confere a contagem, NÃO remove nada.
 *   ClearDrop.run()   — remove todos, um a um, depois de você digitar o nome do Projeto.
 *   ClearDrop.stop()  — para depois do arquivo da vez.
 * Rodar run() de novo depois de uma parada continua dos que restaram.
 *
 * O site NÃO pede confirmação ao remover (medido em 2026-10-18): a confirmação digitada
 * deste script é a única proteção. Nada sai do navegador: o script só clica na página.
 * Seletores e rótulos: meta/CONTEXT.md, seção crítica; regras em meta/DECISIONS.md (DEC-003).
 */
(() => {
  'use strict';

  // Âncoras de busca — um lugar só, nomes que dizem o que procuram (DEC-003).
  const SELECTORS = {
    filesModal: '[role="dialog"]',
    filesModalMarker: '[data-testid="project-doc-upload"]',
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
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  /** Repete `check()` até devolver algo verdadeiro; devolve esse valor, ou null no teto. */
  async function waitFor(check, timeoutMs) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
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

  /** O modal de arquivos é o diálogo que contém o botão de upload do Projeto. */
  function findModal() {
    return [...document.querySelectorAll(SELECTORS.filesModal)]
      .find((dialog) => dialog.querySelector(SELECTORS.filesModalMarker)) || null;
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

  /** Espera a lista parar de recarregar: sem spinner por `settleQuietMs` seguidos. */
  async function settle() {
    const start = Date.now();
    let quietSince = Date.now();
    while (Date.now() - start < TIMING.settleMaxMs) {
      const modal = findModal();
      if (!modal || modal.querySelector(SELECTORS.listSpinner)) quietSince = Date.now();
      else if (Date.now() - quietSince >= TIMING.settleQuietMs) return modal;
      await sleep(TIMING.pollMs);
    }
    return null;
  }

  /** Confere tudo antes de agir; devolve o estado da tela ou para com mensagem. */
  function preflight() {
    if (!/^\/project\//.test(location.pathname)) fail('Esta aba não é a página de um Projeto (claude.ai/project/...).');
    const modal = findModal();
    if (!modal) fail('Não achei a lista de arquivos aberta. Abra-a e rode de novo.');
    if (hasNativeBulk(modal)) {
      fail('Este Projeto já tem «Selecionar» (exclusão em lote nativa). Use: Selecionar → Selecionar tudo → Excluir.');
    }
    const project = projectName();
    if (!project) fail('Não li o nome do Projeto no título da aba.');
    const rows = listRows(modal);
    const unnamed = rows.filter((row) => !row.name).length;
    if (unnamed) fail(`${unnamed} linha(s) sem nome legível: o layout mudou.`);
    const footer = footerCount(modal);
    if (footer === null) fail('Não li a contagem do rodapé («N arquivos»).');
    if (footer !== rows.length) fail(`O rodapé diz ${footer} e a lista tem ${rows.length} linhas.`);
    return { modal, rows, footer, project };
  }

  /** Mensagem de parada no console e em alerta, com o progresso quando houver. */
  function report(error, progress) {
    const known = error instanceof StopError;
    let text = `ClearDrop parou: ${known ? error.message : `erro inesperado — ${error && error.message}`}`;
    if (progress) {
      text += `\nRemovidos ${progress.removed} de ${progress.total}; restam ${progress.total - progress.removed}.`;
      if (progress.current) text += ` Parou em «${progress.current}».`;
      text += ' Rodar ClearDrop.run() de novo continua dos que restaram.';
    } else {
      text += '\nNada foi removido.';
    }
    console.error(text);
    if (!known) console.error(error);
    alert(text);
  }

  /** Ensaio: lista e confere, sem remover. Devolve os nomes, ou null se parou. */
  function scan() {
    try {
      const state = preflight();
      console.log(`ClearDrop — ensaio: ${state.footer} arquivo(s) no Projeto «${state.project}». Nada foi removido.`);
      console.table(state.rows.map((row) => ({ arquivo: row.name })));
      return state.rows.map((row) => row.name);
    } catch (error) {
      report(error);
      return null;
    }
  }

  /** Remove um arquivo pelo nome; confere menu, sumiço, assentamento e rodapé. */
  async function removeOne(name) {
    const modal = findModal() || fail('A lista de arquivos fechou.');
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

  /** Remove todos os arquivos do Projeto aberto, após confirmação digitada. */
  async function run() {
    stopRequested = false;
    let state;
    try {
      state = preflight();
    } catch (error) {
      report(error);
      return;
    }
    if (state.footer === 0) {
      console.log('ClearDrop: o Projeto já está sem arquivos.');
      return;
    }
    const names = state.rows.map((row) => row.name);
    console.table(names.map((name) => ({ arquivo: name })));
    const typed = prompt(
      `ClearDrop vai remover ${state.footer} arquivo(s) do Projeto «${state.project}» (lista no console).\n` +
      'Não há como desfazer, e o site não pede confirmação.\n\nDigite o nome do Projeto para confirmar:'
    );
    if (typed === null || typed.trim() !== state.project) {
      console.log('ClearDrop: cancelado — nada foi removido.');
      return;
    }

    const progress = { removed: 0, total: names.length, current: null };
    try {
      for (const name of names) {
        if (stopRequested) fail('Parado a pedido (ClearDrop.stop()).');
        progress.current = name;
        await removeOne(name);
        progress.removed += 1;
        progress.current = null; // «Parou em» só nomeia o arquivo cuja remoção falhou.
        console.log(`ClearDrop [${progress.removed}/${progress.total}] removido: ${name}`);
        await sleep(TIMING.paceMinMs + Math.random() * (TIMING.paceMaxMs - TIMING.paceMinMs));
      }
      const text = `ClearDrop: ${progress.removed} arquivo(s) removido(s) do Projeto «${state.project}».`;
      console.log(text);
      alert(text);
    } catch (error) {
      report(error, progress);
    }
  }

  /** Pede para parar depois do arquivo da vez. */
  function stop() {
    stopRequested = true;
    console.log('ClearDrop: vai parar depois do arquivo da vez.');
  }

  window.ClearDrop = { version: '0.1.1', scan, run, stop, SELECTORS, LABELS, TIMING };
  console.log('ClearDrop 0.1.1 carregado. ClearDrop.scan() = ensaio · ClearDrop.run() = remover tudo · ClearDrop.stop() = parar.');
})();
