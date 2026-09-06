# SAGIS vs GAP Comparative Study — Website

A fresh, standalone site for the SAGIS-vs-GAP comparative study. Patients fill
in one continuous questionnaire (Part A demographics → Part B SAGIS written
Likert items → Part C GAP video pictograms → Part E overall feedback), and
responses are saved to PostgreSQL. Admin can log in to view/export/clear
responses, same concept as your original GAP validation site.

## What changed vs. the old GAP validation tool

The old site's questionnaire (aligns / represents / differentiates /
misinterpret / design / size / color / speed, per symptom) was an **expert
content-validation instrument**. That's been fully removed. In its place is
the **patient-facing SAGIS vs GAP comparative questionnaire** from your
uploaded document:

- **Part A** — demographics (name/initials, sex, age, race, education,
  contact, smoking, glasses/lenses)
- **Part B — SAGIS**: 22 symptom items, each rated on the 5-point 0–4 scale
  (None/Mild/Moderate/Severe/Very Severe) — plain radio buttons, no typing —
  plus a 6-item Yes/No checklist (headache, back pain, chronic fatigue,
  depression, sleep disturbance, excessive anxiety), plus two optional
  open-text boxes ("main concern" / "second concern")
- **Part C — GAP**: the same 24 pictogram items (22 shared with SAGIS, plus
  anxiety and depression), each rated by picking ONE of 4 videos
  (No Symptom / Mild / Moderate / Severe) — this is the only part that uses
  video
- **Part E** — two 5-point Likert feedback questions, a
  SAGIS-vs-GAP-vs-no-difference preference, and free-text comments

All 24 pictograms are kept, with **all their severity levels** (mild,
moderate, severe, plus the shared "No Symptom" video) — nothing about the
pictogram videos themselves was touched.

English and Bahasa Melayu are shown together throughout, matching your
document.

## Project layout

```
server.js                 Express server (routes, DB, Excel export)
db.js                      PostgreSQL connection (same pattern as before)
scripts/generate-schema.js Regenerates sql/schema.sql from the symptom data
sql/schema.sql             CREATE TABLE statement — run this once on your DB
public/
  index.html               The patient questionnaire (Parts A/B/C/E)
  app.js                   Client logic: step navigation, rendering, submit
  symptoms-data.js         Single source of truth: the 22 SAGIS + 24 GAP items
  style.css
  videos/                  Your existing 24 pictogram folders + none.mp4
                           (copied over unchanged from the old repo)
  login.html / login.js / login.css     Admin login
  responses.html / responses.js / responses.css   Admin view/export/clear
```

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up the database.** Create a PostgreSQL database (e.g. a new Render
   Postgres instance, or reuse your existing one if you want a separate
   table there), then run:
   ```bash
   psql "<your-connection-string>" -f sql/schema.sql
   ```
   This creates a `responses` table with columns matching every SAGIS item,
   every GAP item, and the Part A/E fields exactly.

3. **Environment variables.** Copy `.env.example` to `.env` and fill in your
   real DB credentials and an admin username/password:
   ```bash
   cp .env.example .env
   ```

4. **Run it**
   ```bash
   npm start
   ```
   Visit `http://localhost:3000` for the patient questionnaire, and
   `http://localhost:3000/login.html` for the admin panel.

## If you ever need to add/remove a symptom item

Edit `public/symptoms-data.js` (the single source of truth for both SAGIS
and GAP item lists), then run:
```bash
npm run generate-schema
```
This rewrites `sql/schema.sql` to match — re-run that SQL against your DB
(note it does `DROP TABLE IF EXISTS responses` first, so back up any data
you want to keep before doing that on a live database).

## Video files

The `public/videos/` folder was copied from your existing GAP repo as-is —
same 24 subfolders (one per symptom), same filenames, same severity levels
(mild/moderate/severe) plus the single shared `none.mp4` for "No Symptom".
A few filenames have pre-existing inconsistencies (extra spaces, "sev" vs
"severe", a typo in "postprandal") — these were preserved exactly as they
are on disk and mapped correctly in `symptoms-data.js`, so nothing needed
renaming.

## Deploying

Same as before — this is still a plain Node/Express app, so it deploys to
Render (or wherever you hosted the original) the same way: point it at this
repo, set the environment variables from `.env.example` in the dashboard,
and set the start command to `npm start`.
