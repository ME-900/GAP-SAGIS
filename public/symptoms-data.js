// symptoms-data.js
// Shared data: the 24 GAP pictogram symptoms (with video file mapping) and
// the 22 SAGIS written-questionnaire symptoms. Loaded by both index.html (as a
// <script>) in the browser.
//
// NOTE ON VIDEO FILENAMES: the files in /videos/<folder>/ were provided as-is
// from the original GAP project and have inconsistent naming (spaces, "sev" vs
// "severe", a stray typo "postprandal", a trailing space in one filename).
// Those exact names are preserved below so playback keeps working without
// renaming any files on disk.

const GAP_SYMPTOMS = [
  { num: 1, key: "gerd", folder: "gerd",
    en: "Burning sensation in the oesophagus, belching and regurgitation of acid into the oesophagus (the tube joining the mouth and stomach)",
    bm: "Rasa terbakar di dalam esofagus, sendawa dan muntah asid ke dalam esofagus (saluran yang menghubungkan bahagian mulut dan perut)",
    files: { mild: "1. gerd mild.mp4", moderate: "1. gerd mod.mp4", severe: "1. gerd sev.mp4" } },
  { num: 2, key: "dysphagia", folder: "dysphagia",
    en: "Dysphagia (difficulty swallowing)",
    bm: "Dysphagia (Sukar untuk menelan)",
    files: { mild: "2. dysphagia mild.mp4", moderate: "2. dysphagia mod.mp4", severe: "2. dysphagia sev.mp4" } },
  { num: 3, key: "fullness", folder: "fullness",
    en: "Fullness (feeling of stomach filled to capacity without relation to prior food intake)",
    bm: "Rasa kenyang (Perut terasa penuh tanpa kaitan dengan pengambilan makanan yang sebelumnya)",
    files: { mild: "3. fullness mild.mp4", moderate: "3. fullness mod.mp4", severe: "3. fullness.mp4" } },
  { num: 4, key: "early_satiety", folder: "early satiety",
    en: "Early satiety (stomach is overfilled soon after starting to eat, disproportionate to the quantity of food taken, so that food cannot be finished)",
    bm: "Cepat kenyang (Perut terasa seperti diisi secara berlebihan sejurus selepas makan, tidak bersesuaian dengan kuantiti yang diambil, menyebabkan makanan tidak dapat dihabiskan)",
    files: { mild: "4. early satiety mild.mp4", moderate: "4. early satiety mod.mp4", severe: "4. early satiety severe.mp4" } },
  { num: 5, key: "postprandial_pain", folder: "postprandial",
    en: "Pain or discomfort after meals (upper abdominal symptoms start or get worse after meals)",
    bm: "Sakit atau tidak selesa selepas makan (gejala bahagian atas perut bermula atau semakin teruk selepas makan)",
    files: { mild: "5.postprandial mild.mp4", moderate: "5.postprandal mod.mp4", severe: "5. postprandial sev.mp4" } },
  { num: 6, key: "epigastric_pain", folder: "epigastric",
    en: "Epigastric pain / upper abdominal pain (pain between the bottom edge of the rib cage, below the breastbone)",
    bm: "Kesakitan epigastrik / abdomen atas (sakit antara tulang rusuk bawah, di bawah tulang dada)",
    files: { mild: "6. epigastric pain mild.mp4", moderate: "6. epigastric pain mod.mp4", severe: "6. epigastric pain severe.mp4" } },
  { num: 7, key: "retrosternal_discomfort", folder: "retrosternal",
    en: "Retrosternal discomfort (unpleasant feeling behind the breastbone)",
    bm: "Tidak selesa di bahagian retrosternal (rasa tidak selesa di belakang tulang dada)",
    files: { mild: "7. retrosternal mild.mp4", moderate: "7. retrosternal mod.mp4", severe: "7. retrosternal severe.mp4" } },
  { num: 8, key: "pain_before_defecation", folder: "pain before def",
    en: "Pain or discomfort prior to passing stools",
    bm: "Sakit atau tidak selesa sebelum membuang air besar",
    files: { mild: "8. pain before def mild.mp4", moderate: "8. pain before def mod.mp4", severe: "8. pain before def severe.mp4" } },
  { num: 9, key: "difficulty_defecating", folder: "dif defecating",
    en: "Difficulty passing stools (straining or incomplete evacuation)",
    bm: "Sukar membuang air besar (meneran dengan kuat atau rasa tidak lawas)",
    files: { mild: "9. dif defecating mild.mp4", moderate: "9. dif defecating mod .mp4", severe: "9. dif defecating severe.mp4" } },
  { num: 10, key: "constipation", folder: "constipation",
    en: "Constipation (reduced frequency of bowel movements, hard and lumpy stool)",
    bm: "Sembelit (kekerapan membuang air besar berkurang, najis keras dan berketul)",
    files: { mild: "10. constipation mild.mp4", moderate: "10. constipation mod.mp4", severe: "10. constipation severe.mp4" } },
  { num: 11, key: "loose_stool", folder: "loose stool",
    en: "Loose stool (soft or watery stool)",
    bm: "Najis lembut (lembik atau berair)",
    files: { mild: "11. loose stool mild.mp4", moderate: "11. loose stool mod.mp4", severe: "11. loose stool severe.mp4" } },
  { num: 12, key: "incontinence", folder: "incontinence",
    en: "Incontinence (inability to control stool)",
    bm: "Inkontinens (ketidakupayaan mengawal najis)",
    files: { mild: "12. incontinence mild.mp4", moderate: "12. incontinence mod.mp4", severe: "12. incontinence severe.mp4" } },
  { num: 13, key: "urgency", folder: "urgency",
    en: "Urgency to pass stools",
    bm: "Rasa tergesa-gesa untuk buang air besar",
    files: { mild: "13. urgency mild.mp4", moderate: "13. urgency mod.mp4", severe: "13. urgency severe.mp4" } },
  { num: 14, key: "diarrhea", folder: "diarrhea",
    en: "Diarrhoea (increased frequency of bowel movements, often associated with watery or loose stool)",
    bm: "Cirit-birit (kekerapan buang air besar meningkat, selalunya dikaitkan dengan najis berair dan lembik)",
    files: { mild: "14. diarrhea mild.mp4", moderate: "14. diarrhea mod.mp4", severe: "14. diarrhea severe.mp4" } },
  { num: 15, key: "loss_of_appetite", folder: "loss of appetite",
    en: "Loss of appetite (not feeling hungry)",
    bm: "Hilang selera makan (tidak berasa lapar)",
    files: { mild: "15. loss of appetite mild.mp4", moderate: "15. loss of appetite mod.mp4", severe: "15. loss of appetite severe.mp4" } },
  { num: 16, key: "abdominal_cramps", folder: "abd cramp",
    en: "Abdominal cramps (spasmodic or colic-like stomach pain without specific location)",
    bm: "Kekejangan abdomen (sakit perut seakan kejang atau kembung tanpa bahagian tertentu)",
    files: { mild: "16. abd cramp mild.mp4", moderate: "16. abd cramp mod.mp4", severe: "16. abd cramp severe.mp4" } },
  { num: 17, key: "sickness", folder: "sickness",
    en: "Sickness (the feeling you have before you need to vomit)",
    bm: "Kesakitan yang dialami sebelum hendak muntah",
    files: { mild: "17. sickness mild.mp4", moderate: "17. sickness mod.mp4", severe: "17. sickness severe.mp4" } },
  { num: 18, key: "nausea", folder: "nausea",
    en: "Nausea (an urgent feeling of the need to vomit)",
    bm: "Loya (rasa mendesak untuk muntah)",
    files: { mild: "18. nausea mild.mp4", moderate: "18. nausea mod.mp4", severe: "18. nausea severe.mp4" } },
  { num: 19, key: "vomiting", folder: "vomiting",
    en: "Vomiting (vomiting of mucus and/or stomach contents/food, or strong unproductive retching)",
    bm: "Muntah (memuntahkan lendir dan/atau isi perut/makanan/muntah kosong)",
    files: { mild: "19. vomiting mild.mp4", moderate: "19. vomiting mod.mp4", severe: "19. vomiting sev.mp4" } },
  { num: 20, key: "bloating", folder: "bloating",
    en: "Bloating (feeling of swelling of the abdomen and excessive gas in the abdomen)",
    bm: "Kembung (perut terasa mengembang dan angin berlebihan)",
    files: { mild: "20. bloating mild.mp4", moderate: "20. bloating mod.mp4", severe: "20. bloating sev.mp4" } },
  { num: 21, key: "flatulence", folder: "flatulence",
    en: "Excessive gas/flatulence",
    bm: "Angin dan kentut",
    files: { mild: "21. flatulence mild.mp4", moderate: "21. flatulence mod.mp4", severe: "21. flatulence sev.mp4" } },
  { num: 22, key: "belching", folder: "belching",
    en: "Excessive belching (without acid)",
    bm: "Sendawa berlebihan (tanpa asid)",
    files: { mild: "22. belching mild.mp4", moderate: "22. belching mod.mp4", severe: "22. belching sev.mp4" } },
  { num: 23, key: "anxiety", folder: "anxiety",
    en: "Anxiety",
    bm: "Kebimbangan / Resah",
    files: { mild: "anxiety mild.mp4", moderate: "anxiety mod.mp4", severe: "anxiety severe.mp4" } },
  { num: 24, key: "depression", folder: "depression",
    en: "Depression",
    bm: "Kemurungan",
    files: { mild: "depression mild.mp4", moderate: "depression mod.mp4", severe: "depression severe.mp4" } },
];

// The "No Symptom" option shares one generic video across all 24 items.
const NONE_VIDEO = "none.mp4";

// SAGIS (Part B) covers the same first 22 symptom descriptions as GAP items
// 1-22 (anxiety/depression are NOT scored 0-4 in SAGIS; they appear only as
// part of the separate Yes/No checklist below), rated on a 5-point 0-4 scale.
const SAGIS_SYMPTOMS = GAP_SYMPTOMS.filter(s => s.num <= 22);

const SAGIS_SCALE = [
  { value: 0, en: "None", bm: "Tiada masalah", desc_en: "No problem", desc_bm: "Tiada masalah" },
  { value: 1, en: "Mild", bm: "Ringan", desc_en: "Can be ignored if not thought about", desc_bm: "Boleh diabaikan apabila tidak memikirkannya" },
  { value: 2, en: "Moderate", bm: "Sederhana", desc_en: "Cannot be ignored, but does not affect daily activities", desc_bm: "Tidak boleh diabaikan, tetapi tidak mempengaruhi aktiviti harian" },
  { value: 3, en: "Severe", bm: "Teruk", desc_en: "Affects concentration on daily activities", desc_bm: "Mempengaruhi tumpuan pada aktiviti harian" },
  { value: 4, en: "Very Severe", bm: "Sangat teruk", desc_en: "Greatly affects daily activities and/or requires rest", desc_bm: "Sangat mempengaruhi aktiviti harian dan/atau memerlukan rehat" },
];

const GAP_SCALE = [
  { value: 0, en: "No Symptom", bm: "Tiada Simptom" },
  { value: 1, en: "Mild", bm: "Ringan" },
  { value: 2, en: "Moderate", bm: "Sederhana" },
  { value: 3, en: "Severe", bm: "Teruk" },
];

// Yes/No checklist in Part B (separate from the 0-4 rated items)
const SAGIS_YESNO = [
  { key: "headache", en: "Headache", bm: "Sakit kepala" },
  { key: "back_pain", en: "Back pain", bm: "Sakit belakang" },
  { key: "chronic_fatigue", en: "Chronic fatigue (extreme tiredness)", bm: "Penat melampau" },
  { key: "depression_yn", en: "Depression", bm: "Kemurungan" },
  { key: "sleep_disturbance", en: "Sleep disturbance", bm: "Gangguan tidur" },
  { key: "excessive_anxiety", en: "Excessive anxiety", bm: "Kebimbangan melampau" },
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { GAP_SYMPTOMS, SAGIS_SYMPTOMS, SAGIS_SCALE, GAP_SCALE, SAGIS_YESNO, NONE_VIDEO };
}
