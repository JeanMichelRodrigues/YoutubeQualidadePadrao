const $ = (id) => document.getElementById(id);
const t = (key, ...subs) => chrome.i18n.getMessage(key, subs.map(String));

document.documentElement.lang = chrome.i18n.getUILanguage();
document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));

let state = { ...DQ_DEFAULTS };

// "Máxima" primeiro, depois cada nível do menor ao maior.
const OPTIONS = [["max", t("max")], ...DQ_LEVELS];
const buttons = OPTIONS.map(([value, label]) => {
  const b = document.createElement("button");
  b.className = "level";
  b.textContent = label;
  b.onclick = () => {
    state.quality = value;
    render();
    chrome.storage.sync.set({ quality: value });
  };
  $("levels").appendChild(b);
  return b;
});

function render() {
  buttons.forEach((b, i) => b.classList.toggle("active", OPTIONS[i][0] === state.quality));
}

["enabled", "ignoreLive"].forEach((k) => {
  $(k).onchange = () => {
    state[k] = $(k).checked;
    chrome.storage.sync.set({ [k]: state[k] });
  };
});

const donateUrl = dqDonateUrl(chrome.i18n.getUILanguage());
if (donateUrl) {
  $("donate").href = donateUrl;
  $("donate").hidden = false;
}

chrome.storage.sync.get(DQ_DEFAULTS, (s) => {
  state = { ...s };
  ["enabled", "ignoreLive"].forEach((k) => ($(k).checked = state[k]));
  render();
});
