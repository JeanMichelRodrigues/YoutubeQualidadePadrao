const $ = (id) => document.getElementById(id);
const t = (key, ...subs) => chrome.i18n.getMessage(key, subs.map(String));

document.documentElement.lang = chrome.i18n.getUILanguage();
document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));

let state = { ...DQ_DEFAULTS };

// Posições da barra: Automática, cada nível do menor ao maior e Máxima.
const STEPS = [["auto", t("auto")], ...DQ_LEVELS, ["max", t("max")]];
const stepOf = (value) => Math.max(0, STEPS.findIndex(([v]) => v === value));

// Uma linha por tipo de vídeo: nome, qualidade atual e a barra.
const rows = DQ_TYPES.map(([key, label]) => {
  const row = document.createElement("div");
  row.className = "type";
  const head = document.createElement("div");
  head.className = "head";
  const name = document.createElement("span");
  name.textContent = t(label);
  const value = document.createElement("b");
  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = 0;
  slider.max = STEPS.length - 1;
  slider.step = 1;
  slider.setAttribute("aria-label", t(label));
  slider.oninput = () => {
    state[key] = STEPS[slider.value][0];
    value.textContent = STEPS[slider.value][1];
    chrome.storage.sync.set({ [key]: state[key] });
  };
  head.append(name, value);
  row.append(head, slider);
  $("types").appendChild(row);
  return { key, row, name, label, slider, value };
});

function render() {
  rows.forEach(({ key, row, name, label, slider, value }, n) => {
    const i = stepOf(state[key]);
    slider.value = i;
    value.textContent = STEPS[i][1];
    // Com "mesma qualidade para todos" só a primeira barra aparece e vale para qualquer vídeo.
    row.hidden = state.sameQuality && n > 0;
    name.textContent = t(state.sameQuality && n === 0 ? "typeAll" : label);
  });
}

$("enabled").onchange = () => {
  state.enabled = $("enabled").checked;
  chrome.storage.sync.set({ enabled: state.enabled });
};

$("same").onchange = () => {
  state.sameQuality = $("same").checked;
  chrome.storage.sync.set({ sameQuality: state.sameQuality });
  render();
};

const donateUrl = dqDonateUrl(chrome.i18n.getUILanguage());
if (donateUrl) {
  $("donate").href = donateUrl;
  $("donate").hidden = false;
}

chrome.storage.sync.get(DQ_DEFAULTS, (s) => {
  state = { ...s };
  $("enabled").checked = state.enabled;
  $("same").checked = state.sameQuality;
  render();
});
