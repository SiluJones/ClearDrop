/**
 * ClearDrop — service worker da extensão (DEC-006).
 * O clique no ícone manda «cleardrop:start» para a aba. Se a aba não tem o content script
 * (não é o claude.ai, ou a página foi aberta antes de a extensão ser instalada ou
 * recarregada), mostra «!» no ícone e explica no título, por alguns segundos.
 */
const HINT_MS = 6000;
const DEFAULT_TITLE = chrome.runtime.getManifest().action.default_title;

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab || tab.id === undefined) return;
  try {
    await chrome.tabs.sendMessage(tab.id, { type: 'cleardrop:start' });
  } catch {
    await chrome.action.setBadgeText({ tabId: tab.id, text: '!' });
    await chrome.action.setTitle({
      tabId: tab.id,
      title: 'ClearDrop: abra um Projeto no claude.ai. Se já está nele, recarregue a página (F5).',
    });
    setTimeout(() => {
      chrome.action.setBadgeText({ tabId: tab.id, text: '' }).catch(() => {});
      chrome.action.setTitle({ tabId: tab.id, title: DEFAULT_TITLE }).catch(() => {});
    }, HINT_MS);
  }
});
