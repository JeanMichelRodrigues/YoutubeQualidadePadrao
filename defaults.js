// Configurações padrão, compartilhadas por content.js e popup.js.
// Cada tipo de vídeo tem a sua qualidade: "auto" (o YouTube decide), "max" ou um nível do player.
const DQ_DEFAULTS = {
  enabled: true,         // extensão ligada
  sameQuality: true,     // mesma qualidade para todos os tipos (usa a de vídeos comuns)
  qualityNormal: "hd1080", // vídeos comuns
  qualityLive: "hd1080",   // transmissões ao vivo
  qualityMusic: "hd1080",  // vídeos da categoria Música
};
// Tipos de vídeo, na ordem em que aparecem no popup: [chave salva, texto traduzido].
const DQ_TYPES = [
  ["qualityNormal", "typeNormal"],
  ["qualityLive", "typeLive"],
  ["qualityMusic", "typeMusic"],
];
// Níveis do player do YouTube, do menor ao maior, com o rótulo mostrado no popup.
const DQ_LEVELS = [
  ["tiny", "144p"],
  ["small", "240p"],
  ["medium", "360p"],
  ["large", "480p"],
  ["hd720", "720p"],
  ["hd1080", "1080p"],
  ["hd1440", "1440p"],
  ["hd2160", "2160p (4K)"],
];
// Links de doação do popup, por idioma do navegador (mesmos da extensão de velocidade).
const DQ_DONATE_URLS = { pt: "https://livepix.gg/jeanmr", en: "https://ko-fi.com/jeanmr" };
const dqDonateUrl = (lang) => (/^pt/i.test(lang) ? DQ_DONATE_URLS.pt : DQ_DONATE_URLS.en);
