/**
 * Testes do ClearDrop (extension/cleardrop.js + extension/ui.js) num DOM simulado (jsdom),
 * montado sobre o outerHTML REAL da lista «Arquivos» do layout «limbo» (medido em 2026-10-17;
 * classes, estilos e SVG removidos). Um "site" simulado reage como o medido:
 *   - «Mostrar arquivos» (data-quiet-row="context") abre a lista — medido em 2026-10-19;
 *   - menu ⋮ com um item, o outerHTML MEDIDO (tests/fixtures/menu-limbo.html), com o glifo do
 *     ícone — menu escrito à mão escondeu o FIX-001;
 *   - remoção sem confirmação e recarga da lista com spinner — medido em 2026-10-18;
 *   - opcional: a lista fecha num «clique fora» (pointerdown fora dela), como diálogos do site.
 * Fechar e reabrir a lista preserva o estado (os arquivos removidos continuam removidos).
 * Rodar: npm test.
 */
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const MODAL = fs.readFileSync(path.join(__dirname, 'fixtures', 'modal-limbo.html'), 'utf8');
const MENU = fs.readFileSync(path.join(__dirname, 'fixtures', 'menu-limbo.html'), 'utf8');
const EXT = path.join(__dirname, '..', 'extension');
const CORE = fs.readFileSync(path.join(EXT, 'cleardrop.js'), 'utf8');
const UI = fs.readFileSync(path.join(EXT, 'ui.js'), 'utf8');
const TRIGGER = 'button[aria-haspopup="menu"]:not([data-testid])';

/** Monta uma página de Projeto com a lista real e um "site" simulado que reage aos cliques. */
function page({ menuLabel = 'Remover do projeto', confirmDialog = false, nativeSelect = false, promptAnswer = 'mapsmith',
  dropRow = false, listOpen = true, closeOnOutside = false, closeAfterRemovals = 0, withUi = false, stallWhileHidden = false } = {}) {
  const dom = new JSDOM(`<!doctype html><html><head><title>mapsmith - Claude</title></head><body>
    <main><button type="button" aria-label="Mostrar arquivos" data-quiet-row="context"></button></main>${MODAL}</body></html>`,
    { url: 'https://claude.ai/project/abc', runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window, d = w.document;
  Object.defineProperty(w.HTMLElement.prototype, 'innerText', { get() { return this.textContent; } });
  const log = { alerts: [], errors: [], opens: 0 };
  w.alert = (m) => log.alerts.push(m);
  w.prompt = () => promptAnswer;
  w.console = { log() {}, table() {}, error: (m) => log.errors.push(String(m)) };
  // Aba oculta (janela minimizada): o teste liga e desliga; o navegador real faz isso sozinho.
  const view = { hidden: false };
  Object.defineProperty(d, 'hidden', { configurable: true, get: () => view.hidden });
  const modal = d.querySelector('[role="dialog"]');
  const portal = modal.closest('[data-cds-portal]') || modal;
  // O rodapé real é um nó de texto («35 arquivos») dentro de um span com outros filhos.
  const walker = d.createTreeWalker(modal, w.NodeFilter.SHOW_TEXT);
  let footerEl = null; while (walker.nextNode()) if (/^\d+ arquivos$/.test(walker.currentNode.nodeValue.trim())) { footerEl = walker.currentNode; break; }
  if (!footerEl) throw new Error('fixture sem rodape');
  if (nativeSelect) { const b = d.createElement('button'); b.setAttribute('aria-pressed', 'false'); b.innerHTML = '<span aria-hidden="true">\ue0b3</span><span>Selecionar</span>'; modal.prepend(b); }
  if (dropRow) { const t = modal.querySelector(TRIGGER); let r = t; while (!r.querySelector('time')) r = r.parentElement; r.remove(); }
  const closeList = () => portal.remove();
  if (!listOpen) closeList();
  let removals = 0;
  // "Site": abre a lista; abre menu no ⋮; remove a linha no item; recarrega a lista com spinner.
  d.addEventListener('click', (ev) => {
    if (ev.target.closest('button[data-quiet-row="context"]')) { log.opens++; if (!portal.isConnected) d.body.appendChild(portal); return; }
    const trig = ev.target.closest(TRIGGER);
    if (trig) {
      const holder = d.createElement('div'); holder.innerHTML = MENU; const m = holder.firstElementChild;
      m.querySelector('[role="menuitem"] > span:last-child').textContent = menuLabel; // só o rótulo; o ícone fica
      m._row = trig; d.body.appendChild(m); return;
    }
    const item = ev.target.closest('[role="menuitem"]');
    if (item) {
      const m = item.closest('[role="menu"]'); const trigBtn = m._row; m.remove();
      if (confirmDialog) { const c = d.createElement('div'); c.setAttribute('role', 'alertdialog'); c.textContent = 'Tem certeza?'; d.body.appendChild(c); return; }
      setTimeout(() => {
        let r = trigBtn; while (!r.querySelector('time')) r = r.parentElement; r.remove();
        footerEl.nodeValue = (Number(footerEl.nodeValue.match(/\d+/)[0]) - 1) + ' arquivos';
        const s = d.createElement('div'); s.setAttribute('role', 'status'); s.innerHTML = '<span data-cds="Spinner"></span>Carregando...';
        setTimeout(() => modal.appendChild(s), 20);
        // Com a aba oculta, o site real demora a terminar a recarga; aqui ela só termina quando a aba volta.
        const finish = () => { if (stallWhileHidden && view.hidden) setTimeout(finish, 20); else s.remove(); };
        setTimeout(finish, 120);
        removals++;
        if (closeAfterRemovals && removals === closeAfterRemovals) setTimeout(closeList, 60); // fecha no meio da recarga
      }, 30);
    }
  });
  // «Clique fora» fecha a lista, ouvindo na captura do document, como diálogos costumam fazer.
  if (closeOnOutside) {
    d.addEventListener('pointerdown', (ev) => { if (portal.isConnected && !portal.contains(ev.target)) closeList(); }, true);
  }
  w.eval(CORE);
  if (withUi) w.eval(UI);
  Object.assign(w.ClearDrop.TIMING, { pollMs: 5, openMs: 300, menuMs: 300, removeMs: 500, settleQuietMs: 60, settleMaxMs: 2000, paceMinMs: 1, paceMaxMs: 2 });
  const shadow = () => { const h = d.querySelector('cleardrop-ui'); return h && h.isConnected ? h.shadowRoot : null; };
  return { w, d, modal, portal, footerEl, log, shadow, closeList, view, rows: () => modal.querySelectorAll(TRIGGER).length };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function until(fn, ms = 3000) { const t = Date.now(); while (Date.now() - t < ms) { const v = fn(); if (v) return v; await sleep(5); } return null; }
/** Clique de gente: pointerdown/mousedown que atravessam o Shadow DOM, depois o click. */
function press(w, node) {
  node.dispatchEvent(new w.Event('pointerdown', { bubbles: true, composed: true }));
  node.dispatchEvent(new w.Event('mousedown', { bubbles: true, composed: true }));
  node.click();
}
const buttonByText = (root, re) => [...root.querySelectorAll('button')].find((b) => re.test(b.textContent));

let failed = 0;
const check = (name, ok, extra = '') => { console.log(`${ok ? 'OK  ' : 'FALHA'} ${name}${extra ? ' — ' + extra : ''}`); if (!ok) failed++; };

(async () => {
  // ---------- Núcleo pelo Console ----------
  // 1. Ensaio na lista real: 35 nomes, iguais aos aria-label das linhas.
  { const p = page(); const names = await p.w.ClearDrop.scan();
    check('1 scan lista os 35 arquivos', names && names.length === 35, names && `${names.length}; 1º=${names[0]}; último=${names[34]}`);
    check('1 scan nao remove nada', p.rows() === 35 && p.log.alerts.length === 0); }
  // 1b. FIX-001: o item real traz o glifo U+E101 antes do rótulo; tem de ser aceito.
  { const p = page(); const item = (() => { const h = p.d.createElement('div'); h.innerHTML = MENU; return h.querySelector('[role="menuitem"]'); })();
    check('1b fixture do menu tem o glifo do icone', item.textContent.startsWith('\ue101'), JSON.stringify(item.textContent)); }
  // 2. Layout com «Selecionar»: recusa.
  { const p = page({ nativeSelect: true }); const r = await p.w.ClearDrop.scan();
    check('2 recusa no layout nativo', r === null && /Selecionar/.test(p.log.alerts[0] || ''), (p.log.alerts[0] || '').split('\n')[0]); }
  // 3. Rodapé diverge da lista: para antes de agir.
  { const p = page({ dropRow: true }); const r = await p.w.ClearDrop.scan();
    check('3 rodape divergente para', r === null && /rodapé diz 35 e a lista tem 34/.test(p.log.alerts[0] || ''), (p.log.alerts[0] || '').split('\n')[0]); }
  // 4. Remoção completa, com spinner de recarga a cada arquivo.
  { const p = page(); const res = await p.w.ClearDrop.run();
    check('4 run esvazia o Projeto', res.status === 'done' && p.rows() === 0 && /^0 arquivos$/.test(p.footerEl.nodeValue), `status=${res.status} linhas=${p.rows()} rodape="${p.footerEl.nodeValue}"`); }
  // 5. Nome digitado errado: nada sai.
  { const p = page({ promptAnswer: 'outro' }); const res = await p.w.ClearDrop.run();
    check('5 confirmacao errada cancela', res.status === 'cancelled' && p.rows() === 35 && p.log.alerts.length === 0); }
  // 6. Menu com rótulo inesperado: para no 1º, nada sai.
  { const p = page({ menuLabel: 'Excluir' }); await p.w.ClearDrop.run();
    check('6 menu inesperado para', p.rows() === 35 && /não é o esperado: «Excluir»/.test(p.log.alerts[0] || '') && /Removidos 0 de 35/.test(p.log.alerts[0] || ''), (p.log.alerts[0] || '').replace(/\n/g, ' / ')); }
  // 7. Diálogo inesperado depois de «Remover»: para sem clicar nele.
  { const p = page({ confirmDialog: true }); await p.w.ClearDrop.run();
    check('7 dialogo inesperado para', /diálogo inesperado/.test(p.log.alerts[0] || '') && p.d.querySelector('[role="alertdialog"]'), (p.log.alerts[0] || '').split('\n')[0]); }
  // 8. stop() no meio: para entre arquivos e informa o progresso; rodar de novo continua.
  { const p = page(); const running = p.w.ClearDrop.run(); setTimeout(() => p.w.ClearDrop.stop(), 400); await running;
    const parcial = p.rows(); const msg = p.log.alerts[0] || '';
    check('8a stop para no meio', parcial > 0 && parcial < 35 && /Parado a pedido/.test(msg) && new RegExp(`restam ${parcial}\\.`).test(msg) && !/Parou em/.test(msg), `restaram ${parcial}; "${msg.split('\n')[1] || ''}"`);
    p.log.alerts.length = 0; await p.w.ClearDrop.run();
    check('8b run de novo continua do ponto', p.rows() === 0 && /^0 arquivos$/.test(p.footerEl.nodeValue), `alerta="${p.log.alerts[0] || ''}"`); }

  // ---------- Abrir a lista sozinho (F2) ----------
  // 9. Lista fechada: scan abre pelo «Mostrar arquivos» e lista.
  { const p = page({ listOpen: false }); const names = await p.w.ClearDrop.scan();
    check('9 abre a lista sozinho', names && names.length === 35 && p.log.opens === 1 && p.portal.isConnected, `aberturas=${p.log.opens}`); }
  // 10. Sem o botão que abre a lista: para dizendo isso.
  { const p = page({ listOpen: false }); p.d.querySelector('button[data-quiet-row]').remove(); const r = await p.w.ClearDrop.scan();
    check('10 sem botao de abrir para', r === null && /botão que abre a lista/.test(p.log.alerts[0] || ''), (p.log.alerts[0] || '').split('\n')[0]); }
  // 11. A lista fecha no meio da remoção: reabre e termina.
  { const p = page({ closeAfterRemovals: 3 }); const res = await p.w.ClearDrop.run();
    check('11 lista fecha no meio e reabre', res.status === 'done' && p.rows() === 0 && p.log.opens >= 1, `status=${res.status} aberturas=${p.log.opens} msg="${res.message.split('\n')[0]}"`); }
  // 11b. A lista fecha ENTRE dois arquivos (depois de assentar): a remoção seguinte reabre.
  { const p = page(); const res = await p.w.ClearDrop.run({ confirm: async () => true, notify: () => {},
      onProgress: (step) => { if (step.removed === 2) p.closeList(); } });
    check('11b lista fecha entre arquivos e reabre', res.status === 'done' && p.rows() === 0 && p.log.opens === 1, `status=${res.status} aberturas=${p.log.opens} msg="${res.message.split('\n')[0]}"`); }
  // 12. Projeto vazio: não pede confirmação, diz que já está vazio.
  { const p = page(); await p.w.ClearDrop.run(); p.log.alerts.length = 0; let asked = false;
    const res = await p.w.ClearDrop.run({ confirm: async () => { asked = true; return true; }, notify: () => {} });
    check('12 projeto vazio', res.status === 'empty' && !asked, `status=${res.status} "${res.message}"`); }
  // 13. Dois run() ao mesmo tempo: o segundo é recusado.
  { const p = page(); const first = p.w.ClearDrop.run({ confirm: async () => true, notify: () => {} });
    const second = await p.w.ClearDrop.run({ confirm: async () => true, notify: () => {} }); await first;
    check('13 segundo run simultaneo recusado', second.status === 'busy' && p.rows() === 0, `segundo=${second.status}`); }

  // 11c. FIX-002: aba oculta por mais que o teto de recarga (settleMaxMs = 2000 nos testes):
  //      a recarga do site trava enquanto oculta; ao voltar, a remoção continua e termina.
  { const p = page({ stallWhileHidden: true });
    const res = await p.w.ClearDrop.run({ confirm: async () => true, notify: () => {},
      onProgress: (step) => { if (step.removed === 2) { p.view.hidden = true; setTimeout(() => { p.view.hidden = false; }, 3000); } } });
    check('11c aba oculta nao estoura o teto', res.status === 'done' && p.rows() === 0, `status=${res.status} msg="${res.message.split('\n')[0]}"`); }
  // 11e. FIX-002: no Chrome real a aba oculta é desacelerada, e a primeira leitura depois de voltar
  //      vem com um intervalo grande. Simula isso com o relógio saltando 60 s na volta: esse
  //      intervalo não pode entrar de uma vez na conta do teto.
  { const p = page({ stallWhileHidden: true }); const realNow = p.w.Date.now.bind(p.w.Date); let skew = 0;
    p.w.Date.now = () => realNow() + skew;
    const res = await p.w.ClearDrop.run({ confirm: async () => true, notify: () => {},
      onProgress: (step) => { if (step.removed === 2) { p.view.hidden = true; setTimeout(() => { skew += 60000; p.view.hidden = false; }, 300); } } });
    check('11e volta de aba oculta nao conta o intervalo', res.status === 'done' && p.rows() === 0, `status=${res.status} msg="${res.message.split('\n')[0]}"`); }
  // 11d. Arquivo do Projeto com nome começando por «_» sai como qualquer outro.
  { const p = page(); p.modal.querySelector('button[aria-label="CEREBRO.md"]').setAttribute('aria-label', '_TEMPLATE.md');
    const names = await p.w.ClearDrop.scan(); const res = await p.w.ClearDrop.run({ confirm: async () => true, notify: () => {} });
    check('11d arquivo _TEMPLATE.md e removido', names.includes('_TEMPLATE.md') && res.status === 'done' && p.rows() === 0, `status=${res.status}`); }

  // ---------- Janela da extensão (ui.js) ----------
  // 14. Lista fechada → janela com nome, contagem e lista → Cancelar: nada sai, janela some.
  { const p = page({ listOpen: false, withUi: true, closeOnOutside: true }); const started = p.w.ClearDropUI.start();
    const root = await until(() => { const s = p.shadow(); return s && buttonByText(s, /^Remover 35$/) ? s : null; });
    const title = root && root.querySelector('h2').textContent; const items = root ? root.querySelectorAll('li').length : 0;
    check('14a janela mostra nome, contagem e lista', title === 'Remover 35 arquivo(s) do Projeto «mapsmith»?' && items === 35 && p.log.opens === 1, `"${title}" itens=${items}`);
    if (root) press(p.w, buttonByText(root, /^Cancelar$/)); await started;
    check('14b Cancelar nao remove e fecha a janela', p.rows() === 35 && !p.shadow() && p.log.alerts.length === 0, `linhas=${p.rows()} janela=${!!p.shadow()}`); }
  // 15. Remover: o «clique fora» é segurado (a lista não fecha), progresso, resultado «Pronto».
  { const p = page({ withUi: true, closeOnOutside: true }); const started = p.w.ClearDropUI.start();
    const root = await until(() => { const s = p.shadow(); return s && buttonByText(s, /^Remover 35$/) ? s : null; });
    press(p.w, buttonByText(root, /^Remover 35$/));
    check('15a clique na janela nao fecha a lista do site', p.portal.isConnected);
    const midway = await until(() => { const s = p.shadow(); const t = s && s.querySelector('p'); return t && /^Removido \d+ de 35: /.test(t.textContent) ? t.textContent : null; });
    await started;
    const s = p.shadow(); const h2 = s && s.querySelector('h2').textContent; const msg = s && s.querySelector('p').textContent;
    check('15b progresso aparece', !!midway, midway || 'sem progresso');
    check('15c resultado Pronto e Projeto vazio', h2 === 'Pronto' && /35 arquivo\(s\) removido\(s\)/.test(msg) && p.rows() === 0 && p.log.alerts.length === 0, `"${h2}" "${msg}"`);
    press(p.w, buttonByText(s, /^Fechar$/));
    check('15d Fechar some com a janela', !p.shadow()); }
  // 16. Parar pela janela: interrompe, diz quantos restam; o clique seguinte continua.
  { const p = page({ withUi: true }); const started = p.w.ClearDropUI.start();
    const root = await until(() => { const s = p.shadow(); return s && buttonByText(s, /^Remover 35$/) ? s : null; });
    press(p.w, buttonByText(root, /^Remover 35$/));
    const stopBtn = await until(() => { const s = p.shadow(); return s && buttonByText(s, /^Parar$/); });
    await until(() => p.rows() < 34); press(p.w, stopBtn); await started;
    const s = p.shadow(); const h2 = s && s.querySelector('h2').textContent; const msg = s && s.querySelector('p').textContent; const restam = p.rows();
    check('16a Parar interrompe e informa', h2 === 'ClearDrop parou' && /Parado a pedido/.test(msg) && new RegExp(`restam ${restam}\\.`).test(msg) && restam > 0, `restam=${restam} "${(msg || '').split('\n')[1] || ''}"`);
    press(p.w, buttonByText(s, /^Fechar$/));
    const again = p.w.ClearDropUI.start();
    const root2 = await until(() => { const x = p.shadow(); return x && buttonByText(x, new RegExp(`^Remover ${restam}$`)) ? x : null; });
    press(p.w, buttonByText(root2, new RegExp(`^Remover ${restam}$`))); await again;
    check('16b clique seguinte continua do ponto', p.rows() === 0 && /^0 arquivos$/.test(p.footerEl.nodeValue)); }
  // 17. Esc na confirmação cancela.
  { const p = page({ withUi: true }); const started = p.w.ClearDropUI.start();
    await until(() => { const s = p.shadow(); return s && buttonByText(s, /^Remover 35$/); });
    p.d.dispatchEvent(new p.w.KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); await started;
    check('17 Esc cancela', p.rows() === 35 && !p.shadow()); }
  // 18. Layout com «Selecionar» pela janela: recusa com mensagem, nada sai.
  { const p = page({ withUi: true, nativeSelect: true }); await p.w.ClearDropUI.start();
    const s = p.shadow(); const msg = s && s.querySelector('p').textContent;
    check('18 janela recusa no layout nativo', /Selecionar → Selecionar tudo → Excluir/.test(msg || '') && p.rows() === 35, (msg || '').split('\n')[0]); }
  // 19. Nome de arquivo com HTML não vira marcação na janela.
  { const p = page({ withUi: true }); const cover = p.modal.querySelector('button[aria-label="CEREBRO.md"]');
    cover.setAttribute('aria-label', '<img src=x onerror=alert(1)>.md');
    const started = p.w.ClearDropUI.start();
    const root = await until(() => { const s = p.shadow(); return s && buttonByText(s, /^Remover 35$/) ? s : null; });
    const li = root && [...root.querySelectorAll('li')].find((x) => x.textContent.startsWith('<img'));
    check('19 nome com HTML aparece como texto', !!li && !root.querySelector('img'));
    press(p.w, buttonByText(root, /^Cancelar$/)); await started; }

  // 20. Nenhum arquivo da extensão traz caractere de uso privado LITERAL (invisível): escapes
  //     como \ue000 viraram o próprio caractere duas vezes ao serem gravados. Fixtures podem.
  { const bad = fs.readdirSync(EXT).filter((f) => /\.(js|json)$/.test(f))
      .filter((f) => /[\ue000-\uf8ff]/.test(fs.readFileSync(path.join(EXT, f), 'utf8')));
    check('20 extensao sem caractere invisivel literal', bad.length === 0, bad.join(', ')); }

  console.log(failed ? `\n${failed} FALHA(S)` : '\nTODOS OK');
  process.exit(failed ? 1 : 0);
})();
