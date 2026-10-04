// Roda no contexto da própria página (world: MAIN) para usar a API do player do YouTube.
(() => {
  // Do menor ao maior; "highres" é qualquer coisa acima de 4K.
  const ORDER = ["tiny", "small", "medium", "large", "hd720", "hd1080", "hd1440", "hd2160", "highres"];
  let lastKey = null;

  const cfg = () => {
    try {
      return JSON.parse(document.documentElement.dataset.ytDqConfig || "null");
    } catch {
      return null;
    }
  };

  function player() {
    const ids = location.pathname.startsWith("/shorts")
      ? ["shorts-player", "movie_player"]
      : ["movie_player", "shorts-player"];
    for (const id of ids) {
      const p = document.getElementById(id);
      if (p && typeof p.getAvailableQualityLevels === "function") return p;
    }
    return null;
  }

  // Escolhe, entre as qualidades disponíveis neste vídeo, a mais alta que não passa da desejada.
  function pick(want, avail) {
    const levels = avail.filter((q) => ORDER.includes(q));
    if (!levels.length) return null;
    if (want === "max") return levels.reduce((a, b) => (ORDER.indexOf(b) > ORDER.indexOf(a) ? b : a));
    const w = ORDER.indexOf(want);
    const ok = levels.filter((q) => ORDER.indexOf(q) <= w);
    if (ok.length) return ok.reduce((a, b) => (ORDER.indexOf(b) > ORDER.indexOf(a) ? b : a));
    // Nada abaixo do desejado (raro): usa a menor disponível.
    return levels.reduce((a, b) => (ORDER.indexOf(b) < ORDER.indexOf(a) ? b : a));
  }

  function setQuality() {
    const c = cfg();
    const p = player();
    if (!c || !c.enabled || !p) return;
    const d = (typeof p.getVideoData === "function" && p.getVideoData()) || {};
    if (c.ignoreLive && d.isLive) return;
    const q = pick(c.quality, p.getAvailableQualityLevels() || []);
    if (!q) return;
    if (typeof p.setPlaybackQualityRange === "function") p.setPlaybackQualityRange(q, q);
    if (typeof p.setPlaybackQuality === "function") p.setPlaybackQuality(q);
  }

  function apply(force) {
    const c = cfg();
    if (!c || !c.enabled) return;
    const v = document.querySelector("video");
    const key = v ? v.currentSrc || v.src || location.href : location.href;
    if (!force && key === lastKey) return; // uma vez por vídeo; mudanças manuais ficam
    lastKey = key;
    setQuality();
    // A lista de qualidades só fica completa depois de um tempo e o player às vezes reseta; reaplica.
    [300, 1000, 2500].forEach((ms) => setTimeout(setQuality, ms));
  }

  ["loadedmetadata", "playing"].forEach((ev) =>
    document.addEventListener(
      ev,
      (e) => e.target instanceof HTMLVideoElement && apply(false),
      true
    )
  );
  document.addEventListener("yt-navigate-finish", () => apply(true));
  // Troca feita no popup com o vídeo aberto: o player às vezes ignora a mudança no meio da
  // reprodução; se a qualidade não mudou, um seek na posição atual o faz recarregar o stream.
  document.addEventListener("yt-default-quality-changed", () => {
    apply(true);
    setTimeout(() => {
      const c = cfg();
      const p = player();
      if (!c || !c.enabled || !p || typeof p.getPlaybackQuality !== "function") return;
      const want = pick(c.quality, p.getAvailableQualityLevels() || []);
      if (want && p.getPlaybackQuality() !== want && typeof p.seekTo === "function") {
        setQuality();
        p.seekTo(p.getCurrentTime(), true);
      }
    }, 700);
  });
})();
