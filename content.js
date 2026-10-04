// Isolated world: lê as opções salvas e as repassa ao script da página (main.js).
function publish() {
  chrome.storage.sync.get(DQ_DEFAULTS, (s) => {
    document.documentElement.dataset.ytDqConfig = JSON.stringify(s);
    document.dispatchEvent(new CustomEvent("yt-default-quality-changed"));
  });
}

publish();
chrome.storage.onChanged.addListener(publish);
