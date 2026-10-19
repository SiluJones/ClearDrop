/**
 * Testes do src/cleardrop.js num DOM simulado (jsdom), montado sobre o outerHTML REAL do modal
 * «Arquivos» do layout «limbo» (medido em 2026-10-17; classes, estilos e SVG removidos).
 * Um "site" simulado reage aos cliques como o medido em 2026-10-18: menu ⋮ com um item,
 * remoção sem confirmação e recarga da lista com spinner. O menu é o outerHTML MEDIDO
 * (tests/fixtures/menu-limbo.html), com o glifo do ícone — menu escrito à mão escondeu o FIX-001.
 * Rodar: npm test.
 */
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const MODAL = fs.readFileSync(path.join(__dirname, 'fixtures', 'modal-limbo.html'), 'utf8');
const MENU = fs.readFileSync(path.join(__dirname, 'fixtures', 'menu-limbo.html'), 'utf8');
const SCRIPT = fs.readFileSync(path.join(__dirname, '..', 'src', 'cleardrop.js'), 'utf8');

/** Monta uma página de Projeto com o modal real e um "site" simulado que reage aos cliques. */
function page({ menuLabel = 'Remover do projeto', confirmDialog = false, nativeSelect = false, promptAnswer = 'mapsmith', dropRow = false } = {}) {
  const dom = new JSDOM(`<!doctype html><html><head><title>mapsmith - Claude</title></head><body>${MODAL}</body></html>`,
    { url: 'https://claude.ai/project/abc', runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window, d = w.document;
  Object.defineProperty(w.HTMLElement.prototype, 'innerText', { get() { return this.textContent; } });
  const log = { alerts: [], errors: [] };
  w.alert = (m) => log.alerts.push(m);
  w.prompt = () => promptAnswer;
  w.console = { log() {}, table() {}, error: (m) => log.errors.push(String(m)) };
  const modal = d.querySelector('[role="dialog"]');
  // O rodapé real é um nó de texto («35 arquivos») dentro de um span com outros filhos.
  const walker = d.createTreeWalker(modal, w.NodeFilter.SHOW_TEXT);
  let footerEl = null; while (walker.nextNode()) if (/^\d+ arquivos$/.test(walker.currentNode.nodeValue.trim())) { footerEl = walker.currentNode; break; }
  if (!footerEl) throw new Error('fixture sem rodape');
  // Botão «Selecionar» do layout novo, com um ícone aria-hidden como os do site.
  if (nativeSelect) { const b = d.createElement('button'); b.setAttribute('aria-pressed', 'false'); b.innerHTML = '<span aria-hidden="true">\ue0b3</span><span>Selecionar</span>'; modal.prepend(b); }
  if (dropRow) { const t = modal.querySelector('button[aria-haspopup="menu"]:not([data-testid])'); let r = t; while (!r.querySelector('time')) r = r.parentElement; r.remove(); }
  // "Site": abre menu no ⋮; remove a linha no item; recarrega a lista com spinner.
  d.addEventListener('click', (ev) => {
    const trig = ev.target.closest('button[aria-haspopup="menu"]:not([data-testid])');
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
        setTimeout(() => modal.appendChild(s), 20); setTimeout(() => s.remove(), 120);
      }, 30);
    }
  });
  w.eval(SCRIPT);
  Object.assign(w.ClearDrop.TIMING, { pollMs: 5, menuMs: 300, removeMs: 500, settleQuietMs: 60, settleMaxMs: 2000, paceMinMs: 1, paceMaxMs: 2 });
  return { w, d, modal, footerEl, log, rows: () => modal.querySelectorAll('button[aria-haspopup="menu"]:not([data-testid])').length };
}

let failed = 0;
const check = (name, ok, extra = '') => { console.log(`${ok ? 'OK  ' : 'FALHA'} ${name}${extra ? ' — ' + extra : ''}`); if (!ok) failed++; };

(async () => {
  // 1. Ensaio no modal real: 35 nomes, iguais aos aria-label das linhas.
  { const p = page(); const names = p.w.ClearDrop.scan();
    check('1 scan lista os 35 arquivos', names && names.length === 35, names && `${names.length}; 1º=${names[0]}; último=${names[34]}`);
    check('1 scan nao remove nada', p.rows() === 35 && p.log.alerts.length === 0); }
  // 1b. FIX-001: o item real traz o glifo U+E101 antes do rótulo; tem de ser aceito.
  { const p = page(); const item = (() => { const h = p.d.createElement('div'); h.innerHTML = MENU; return h.querySelector('[role="menuitem"]'); })();
    check('1b fixture do menu tem o glifo do icone', item.textContent.startsWith('\ue101'), JSON.stringify(item.textContent)); }
  // 2. Layout com «Selecionar»: recusa.
  { const p = page({ nativeSelect: true }); const r = p.w.ClearDrop.scan();
    check('2 recusa no layout nativo', r === null && /Selecionar/.test(p.log.alerts[0] || ''), (p.log.alerts[0] || '').split('\n')[0]); }
  // 3. Rodapé diverge da lista: para antes de agir.
  { const p = page({ dropRow: true }); const r = p.w.ClearDrop.scan();
    check('3 rodape divergente para', r === null && /rodapé diz 35 e a lista tem 34/.test(p.log.alerts[0] || ''), (p.log.alerts[0] || '').split('\n')[0]); }
  // 4. Remoção completa simulada, com spinner de recarga a cada arquivo.
  { const p = page(); await p.w.ClearDrop.run();
    check('4 run esvazia o Projeto', p.rows() === 0 && /^0 arquivos$/.test(p.footerEl.nodeValue), `linhas=${p.rows()} rodape="${p.footerEl.nodeValue}" alerta="${(p.log.alerts[0] || '').split('\n')[0]}"`); }
  // 5. Nome digitado errado: nada sai.
  { const p = page({ promptAnswer: 'outro' }); await p.w.ClearDrop.run();
    check('5 confirmacao errada cancela', p.rows() === 35 && p.log.alerts.length === 0); }
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
  console.log(failed ? `\n${failed} FALHA(S)` : '\nTODOS OK');
  process.exit(failed ? 1 : 0);
})();
