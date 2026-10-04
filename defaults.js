// Configurações padrão, compartilhadas por content.js e popup.js.
const DQ_DEFAULTS = {
  enabled: true,   // extensão ligada
  quality: "hd1080", // qualidade desejada: "max" ou um nível do player (tiny..highres)
  ignoreLive: false, // não aplicar em vídeos ao vivo
};
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
