// app.js — patient-facing survey logic
const App = (function () {
  const state = {
    sagisScores: {},   // key -> 0-4
    sagisYesNo: {},    // key -> true/false
    gapScores: {},     // key -> 0-3
  };

  const STEP_IDS = ["step-a", "step-b", "step-c", "step-e"];

  function goToStep(index) {
    document.querySelectorAll(".step").forEach(el => el.classList.add("hidden"));
    if (index === -1) {
      document.getElementById("step-intro").classList.remove("hidden");
    } else {
      document.getElementById(STEP_IDS[index]).classList.remove("hidden");
    }
    document.querySelectorAll(".progress-step").forEach((el, i) => {
      el.classList.toggle("active", i === index);
      el.classList.toggle("done", i < index);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function videoPath(folder, filename) {
    return "videos/" + encodeURIComponent(folder) + "/" + encodeURIComponent(filename);
  }

  // ---- Render SAGIS items (Part B): plain Likert radio rows, no video ----
  function renderSagis() {
    const container = document.getElementById("sagisItems");
    let html = "";
    SAGIS_SYMPTOMS.forEach(item => {
      html += `<div class="sagis-item" id="sagis-item-${item.key}">
        <p class="item-label"><strong>${item.num}. ${item.en}</strong><br><span class="bm">${item.bm}</span></p>
        <div class="scale-row">`;
      SAGIS_SCALE.forEach(s => {
        html += `<label class="scale-option" title="${s.desc_en}">
          <input type="radio" name="sagis_${item.key}" value="${s.value}"
            onchange="App.setSagisScore('${item.key}', ${s.value})">
          <span>${s.value} — ${s.en}<br><span class="bm">${s.bm}</span></span>
        </label>`;
      });
      html += `</div></div>`;
    });
    container.innerHTML = html;

    // Yes/No checklist
    const ynContainer = document.getElementById("sagisYesNo");
    let ynHtml = "";
    SAGIS_YESNO.forEach(item => {
      ynHtml += `<div class="yesno-item" id="yesno-item-${item.key}">
        <span>${item.en} <span class="bm">/ ${item.bm}</span></span>
        <div class="radio-row inline">
          <label><input type="radio" name="yn_${item.key}" value="yes" onchange="App.setYesNo('${item.key}', true)"> Yes/Ya</label>
          <label><input type="radio" name="yn_${item.key}" value="no" onchange="App.setYesNo('${item.key}', false)"> No/Tidak</label>
        </div>
      </div>`;
    });
    ynContainer.innerHTML = ynHtml;
  }

  // ---- Render GAP items (Part C): video pictograms per severity ----
  function renderGap() {
    const container = document.getElementById("gapItems");
    let html = "";
    GAP_SYMPTOMS.forEach(item => {
      html += `<div class="gap-item" id="gap-item-${item.key}">
        <p class="item-label"><strong>${item.num}. ${item.en}</strong><br><span class="bm">${item.bm}</span></p>
        <div class="video-scale-row">
          ${renderVideoOption(item, "none", 0, "videos/" + NONE_VIDEO)}
          ${renderVideoOption(item, "mild", 1, videoPath(item.folder, item.files.mild))}
          ${renderVideoOption(item, "moderate", 2, videoPath(item.folder, item.files.moderate))}
          ${renderVideoOption(item, "severe", 3, videoPath(item.folder, item.files.severe))}
        </div>
      </div>`;
    });
    container.innerHTML = html;
  }

  function renderVideoOption(item, labelKey, value, src) {
    const scale = GAP_SCALE[value];
    return `<label class="video-option">
      <video src="${src}" muted loop playsinline autoplay preload="auto"
        onclick="this.paused ? this.play() : this.pause()"></video>
      <div class="video-caption">
        <input type="radio" name="gap_${item.key}" value="${value}" onchange="App.setGapScore('${item.key}', ${value})">
        <span>${scale.en}<br><span class="bm">${scale.bm}</span></span>
      </div>
    </label>`;
  }

  function setSagisScore(key, value) { state.sagisScores[key] = value; clearMissing("sagis-item-" + key); }
  function setYesNo(key, value) { state.sagisYesNo[key] = value; clearMissing("yesno-item-" + key); }
  function setGapScore(key, value) { state.gapScores[key] = value; clearMissing("gap-item-" + key); }

  function val(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : "";
  }
  function radioVal(name) {
    const el = document.querySelector(`input[name="${name}"]:checked`);
    return el ? el.value : null;
  }

  function buildLikert(containerId, name) {
    const container = document.getElementById(containerId);
    const labels = [
      { v: 5, en: "Strongly Agree", bm: "Sangat Setuju" },
      { v: 4, en: "Agree", bm: "Setuju" },
      { v: 3, en: "Neutral", bm: "Neutral" },
      { v: 2, en: "Disagree", bm: "Tidak Setuju" },
      { v: 1, en: "Strongly Disagree", bm: "Sangat Tidak Setuju" },
    ];
    let html = "";
    labels.forEach(l => {
      html += `<label class="likert-option">
        <input type="radio" name="${name}" value="${l.v}">
        <span>${l.v}<br>${l.en}<br><span class="bm">${l.bm}</span></span>
      </label>`;
    });
    container.innerHTML = html;
  }

  // ---- Validation helpers ----
  function markMissing(elId) {
    const el = document.getElementById(elId);
    if (el) el.classList.add("missing");
  }
  function clearMissing(elId) {
    const el = document.getElementById(elId);
    if (el) el.classList.remove("missing");
  }
  function markFieldMissing(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add("missing-field");
  }
  function clearAllMissing(root) {
    root.querySelectorAll(".missing").forEach(el => el.classList.remove("missing"));
    root.querySelectorAll(".missing-field").forEach(el => el.classList.remove("missing-field"));
  }
  function showValidationMessage(stepEl, missingCount) {
    let msg = stepEl.querySelector(".validation-msg");
    if (!msg) {
      msg = document.createElement("div");
      msg.className = "validation-msg";
      stepEl.querySelector(".card").insertBefore(msg, stepEl.querySelector(".card").children[1]);
    }
    if (missingCount > 0) {
      msg.innerHTML = `Please answer all required questions before continuing (${missingCount} left).
        <br><span class="bm">Sila jawab semua soalan yang diperlukan sebelum meneruskan (${missingCount} tertinggal).</span>`;
      msg.classList.remove("hidden");
    } else {
      msg.classList.add("hidden");
    }
  }
  function scrollToFirstMissing(stepEl) {
    const first = stepEl.querySelector(".missing, .missing-field");
    if (first) first.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // ---- Step validators. Open-text fields (concerns/comments) and
  // ---- Step validators. Only the SAGIS "concerns" text boxes and the
  // "other comments" box are intentionally NOT required. ----
  function validatePartA() {
    const stepEl = document.getElementById("step-a");
    clearAllMissing(stepEl);
    let missing = 0;

    if (!val("name_initials")) { markFieldMissing("name_initials"); missing++; }
    if (!radioVal("sex")) { markFieldMissing("sexGroup"); missing++; }
    if (!val("age")) { markFieldMissing("age"); missing++; }
    if (!radioVal("race")) { markFieldMissing("raceGroup"); missing++; }
    if (radioVal("race") === "Other" && !val("race_other")) { markFieldMissing("race_other"); missing++; }
    if (!radioVal("education_level")) { markFieldMissing("educationGroup"); missing++; }
    if (!val("contact_number")) { markFieldMissing("contact_number"); missing++; }
    if (!radioVal("smoking_status")) { markFieldMissing("smokingGroup"); missing++; }
    if (!radioVal("wears_glasses")) { markFieldMissing("glassesGroup"); missing++; }

    showValidationMessage(stepEl, missing);
    if (missing > 0) scrollToFirstMissing(stepEl);
    return missing === 0;
  }

  function validatePartB() {
    const stepEl = document.getElementById("step-b");
    clearAllMissing(stepEl);
    let missing = 0;

    SAGIS_SYMPTOMS.forEach(item => {
      if (state.sagisScores[item.key] === undefined) { markMissing("sagis-item-" + item.key); missing++; }
    });
    SAGIS_YESNO.forEach(item => {
      if (state.sagisYesNo[item.key] === undefined) { markMissing("yesno-item-" + item.key); missing++; }
    });

    showValidationMessage(stepEl, missing);
    if (missing > 0) scrollToFirstMissing(stepEl);
    return missing === 0;
  }

  function validatePartC() {
    const stepEl = document.getElementById("step-c");
    clearAllMissing(stepEl);
    let missing = 0;

    GAP_SYMPTOMS.forEach(item => {
      if (state.gapScores[item.key] === undefined) { markMissing("gap-item-" + item.key); missing++; }
    });

    showValidationMessage(stepEl, missing);
    if (missing > 0) scrollToFirstMissing(stepEl);
    return missing === 0;
  }

  function validatePartE() {
    const stepEl = document.getElementById("step-e");
    clearAllMissing(stepEl);
    let missing = 0;

    if (!radioVal("likert_gap_helped")) { markFieldMissing("likert_gap_helped"); missing++; }
    if (!radioVal("likert_comfortable")) { markFieldMissing("likert_comfortable"); missing++; }
    if (!radioVal("easier_version")) { markFieldMissing("easierGroup"); missing++; }

    showValidationMessage(stepEl, missing);
    if (missing > 0) scrollToFirstMissing(stepEl);
    return missing === 0;
  }

  function nextFromA() { if (validatePartA()) goToStep(1); }
  function nextFromB() { if (validatePartB()) goToStep(2); }
  function nextFromC() { if (validatePartC()) goToStep(3); }

  async function submit() {
    if (!validatePartE()) return;

    const payload = {
      name_initials: val("name_initials"),
      sex: radioVal("sex"),
      age: val("age") ? parseInt(val("age"), 10) : null,
      race: radioVal("race"),
      race_other: val("race_other"),
      education_level: radioVal("education_level"),
      contact_number: val("contact_number"),
      smoking_status: radioVal("smoking_status"),
      wears_glasses: radioVal("wears_glasses"),

      sagis_main_concern: val("sagis_main_concern"),
      sagis_second_concern: val("sagis_second_concern"),

      feedback_gap_helped: radioVal("likert_gap_helped") ? parseInt(radioVal("likert_gap_helped"), 10) : null,
      feedback_comfortable: radioVal("likert_comfortable") ? parseInt(radioVal("likert_comfortable"), 10) : null,
      easier_version: radioVal("easier_version"),
      other_comments: val("other_comments"),
    };

    SAGIS_SYMPTOMS.forEach(item => {
      payload[`sagis_${item.key}`] = state.sagisScores[item.key] ?? null;
    });
    SAGIS_YESNO.forEach(item => {
      payload[`sagis_${item.key}`] = state.sagisYesNo[item.key] ?? null;
    });
    GAP_SYMPTOMS.forEach(item => {
      payload[`gap_${item.key}`] = state.gapScores[item.key] ?? null;
    });

    try {
      const res = await fetch("/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      document.querySelectorAll(".step").forEach(el => el.classList.add("hidden"));
      document.getElementById("step-done").classList.remove("hidden");
      document.getElementById("progressBar").classList.add("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      alert("There was a problem submitting your responses. Please try again.\n" + err.message);
      console.error(err);
    }
  }

  function init() {
    renderSagis();
    renderGap();
    buildLikert("likert_gap_helped", "likert_gap_helped");
    buildLikert("likert_comfortable", "likert_comfortable");
  }

  document.addEventListener("DOMContentLoaded", init);

  return { goToStep, setSagisScore, setYesNo, setGapScore, submit, nextFromA, nextFromB, nextFromC };
})();
