/**
 * ClearDrop — janela da extensão (content script, roda depois de cleardrop.js). DEC-006.
 *
 * Fluxo: clique no ícone → background.js manda «cleardrop:start» → abrir a lista → janela
 * com nome, contagem e lista → Cancelar / Remover → progresso com «Parar» → resultado.
 *
 * A janela mora num Shadow DOM preso ao <html> (fora do <body>): o CSS do site não a
 * alcança, e o diálogo do site, ao marcar o resto da página como inerte, não a pega.
 * Um clique nela conta como «clique fora» para a lista do site, que pode fechar: aqui
 * seguramos o pointerdown, e o núcleo reabre a lista se ela fechar mesmo assim.
 */
(() => {
  'use strict';

  const STYLE = `
    :host { all: initial; }
    .backdrop { position: fixed; inset: 0; z-index: 2147483647; display: flex; align-items: center;
      justify-content: center; background: rgba(20, 20, 19, .45); font: 14px/1.45 system-ui, sans-serif; }
    .card { width: min(440px, calc(100vw - 32px)); max-height: calc(100vh - 64px); display: flex;
      flex-direction: column; gap: 12px; padding: 20px; border-radius: 12px; background: #fff;
      color: #1f1e1d; box-shadow: 0 12px 40px rgba(0, 0, 0, .25); }
    h2 { margin: 0; font-size: 17px; font-weight: 600; }
    p { margin: 0; color: #5e5d59; }
    p.warn { color: #9a3412; }
    p.error { color: #b91c1c; white-space: pre-line; }
    ul { margin: 0; padding: 8px 12px 8px 28px; overflow: auto; max-height: 40vh; border-radius: 8px;
      background: #f5f4ef; font: 13px/1.6 ui-monospace, monospace; }
    .bar { height: 6px; border-radius: 3px; background: #ebe9e1; overflow: hidden; }
    .bar > div { height: 100%; width: 0; background: #c96442; transition: width .2s; }
    .actions { display: flex; justify-content: flex-end; gap: 8px; }
    button { font: inherit; padding: 8px 14px; border-radius: 8px; border: 1px solid #d6d3c9;
      background: #fff; color: #1f1e1d; cursor: pointer; }
    button:focus-visible { outline: 2px solid #c96442; outline-offset: 2px; }
    button.danger { background: #b91c1c; border-color: #b91c1c; color: #fff; }
    @media (prefers-color-scheme: dark) {
      .card { background: #262624; color: #f5f4ef; }
      p { color: #b7b5a9; } p.warn { color: #fdba74; } p.error { color: #fca5a5; }
      ul { background: #30302e; } .bar { background: #3d3d3a; }
      button { background: #30302e; color: #f5f4ef; border-color: #4a4a46; }
      button.danger { background: #b91c1c; border-color: #b91c1c; color: #fff; }
    }`;

  let host = null;
  let root = null;

  // Segura o «clique fora» na captura da window, que roda antes da captura do document,
  // onde o site escuta. Só pointerdown/mousedown/touchstart: o click segue, e é por ele
  // que os botões da janela respondem. Se ainda assim a lista fechar, o núcleo a reabre.
  for (const type of ['pointerdown', 'mousedown', 'touchstart']) {
    window.addEventListener(type, (event) => {
      if (host && event.composedPath().includes(host)) event.stopPropagation();
    }, true);
  }

  /** Monta (ou reusa) a janela vazia e devolve o cartão onde o conteúdo entra. */
  function mount() {
    if (!host) {
      host = document.createElement('cleardrop-ui');
      root = host.attachShadow({ mode: 'open' });
    }
    if (!host.isConnected) document.documentElement.appendChild(host);
    root.innerHTML = `<style>${STYLE}</style><div class="backdrop"><div class="card" role="dialog" aria-modal="true" aria-label="ClearDrop"></div></div>`;
    return root.querySelector('.card');
  }

  function unmount() {
    if (host) host.remove();
  }

  /** Cria um elemento com texto (nunca innerHTML com dado da página). */
  function el(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  function button(text, onClick, className) {
    const node = el('button', text, className);
    node.type = 'button';
    node.addEventListener('click', onClick);
    return node;
  }

  /** Tela de espera, enquanto a lista abre e é conferida. */
  function showBusy(text) {
    const card = mount();
    card.append(el('h2', 'ClearDrop'), el('p', text));
  }

  /** Confirmação por clique: nome, contagem e lista; Cancelar é o padrão. */
  function confirmWindow(state) {
    return new Promise((resolve) => {
      const card = mount();
      const list = el('ul');
      for (const row of state.rows) list.append(el('li', row.name));
      const cancel = button('Cancelar', () => { cleanup(); resolve(false); });
      const remove = button(`Remover ${state.footer}`, () => { cleanup(); resolve(true); }, 'danger');
      const onKey = (event) => { if (event.key === 'Escape') { cleanup(); resolve(false); } };
      function cleanup() { document.removeEventListener('keydown', onKey, true); }
      document.addEventListener('keydown', onKey, true);
      const actions = el('div', undefined, 'actions');
      actions.append(cancel, remove);
      card.append(
        el('h2', `Remover ${state.footer} arquivo(s) do Projeto «${state.project}»?`),
        list,
        el('p', 'Não há como desfazer: o site não pede confirmação.', 'warn'),
        actions,
      );
      cancel.focus();
    });
  }

  /** Tela de progresso, com «Parar». Devolve a função que a atualiza. */
  function showProgress(total) {
    const card = mount();
    const status = el('p', `Removendo… 0 de ${total}`);
    const fill = el('div');
    const bar = el('div', undefined, 'bar');
    bar.append(fill);
    const stopButton = button('Parar', () => {
      window.ClearDrop.stop();
      stopButton.disabled = true;
      stopButton.textContent = 'Parando…';
    });
    const actions = el('div', undefined, 'actions');
    actions.append(stopButton);
    card.append(el('h2', 'ClearDrop'), status, bar, actions);
    return ({ removed, name }) => {
      status.textContent = `Removido ${removed} de ${total}: ${name}`;
      fill.style.width = `${Math.round((removed / total) * 100)}%`;
    };
  }

  /** Resultado final (ou a parada), com «Fechar». */
  function showResult(result) {
    const card = mount();
    const titles = { done: 'Pronto', empty: 'Nada a remover', error: 'ClearDrop parou', busy: 'ClearDrop' };
    card.append(
      el('h2', titles[result.status] || 'ClearDrop'),
      el('p', result.message, result.status === 'error' ? 'error' : undefined),
    );
    const actions = el('div', undefined, 'actions');
    const close = button('Fechar', unmount);
    actions.append(close);
    card.append(actions);
    close.focus();
  }

  let active = false;

  /** O que o clique no ícone dispara. Um clique durante a execução é ignorado. */
  async function start() {
    if (active) return;
    active = true;
    try {
      showBusy('Abrindo a lista de arquivos…');
      let update = () => {};
      await window.ClearDrop.run({
        confirm: async (state) => {
          const ok = await confirmWindow(state);
          if (ok) update = showProgress(state.footer);
          return ok;
        },
        onProgress: (step) => update(step),
        notify: (result) => (result.status === 'cancelled' ? unmount() : showResult(result)),
      });
    } finally {
      active = false;
    }
  }

  window.ClearDropUI = { start };

  // Ponte com o service worker (só existe dentro da extensão; nos testes, não).
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message && message.type === 'cleardrop:start') {
        start();
        sendResponse({ ok: true });
      }
    });
  }
})();
