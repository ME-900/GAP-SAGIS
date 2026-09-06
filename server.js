const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const ExcelJS = require("exceljs");
const connection = require("./db");
const { GAP_SYMPTOMS, SAGIS_SYMPTOMS, SAGIS_YESNO } = require("./public/symptoms-data.js");

const app = express();
app.use(bodyParser.json({ limit: "2mb" }));

// Serve static files (HTML, CSS, JS, videos) from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ---- Simple admin auth (same lightweight pattern as before) ----
app.get("/authenticate", (req, res) => {
    const authheader = req.headers.authorization;
    res.json({ authenticated: !!authheader });
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    // Change these before deploying.
    if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASSWORD) {
        return res.status(200).json({ message: "Login successful" });
    }
    return res.status(401).json({ error: "You do not have access" });
});

const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.redirect("/login.html");
    next();
};

app.get("/responses", authenticate, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "responses.html"));
});

app.get("/responses-data", (req, res) => {
    connection.query("SELECT * FROM responses ORDER BY id", (err, results) => {
        if (err) {
            console.error("Error retrieving data: " + err.stack);
            return res.status(500).json({ error: "Database error", details: err.message });
        }
        res.status(200).json(results.rows);
    });
});

// ---- Build the ordered column list once, from the shared symptom data ----
const PART_A_COLUMNS = [
    "name_initials", "sex", "age", "race", "race_other",
    "education_level", "contact_number", "smoking_status", "wears_glasses",
];
const SAGIS_SCORE_COLUMNS = SAGIS_SYMPTOMS.map(s => `sagis_${s.key}`);
const SAGIS_YESNO_COLUMNS = SAGIS_YESNO.map(item => `sagis_${item.key}`);
const SAGIS_TEXT_COLUMNS = ["sagis_main_concern", "sagis_second_concern"];
const GAP_SCORE_COLUMNS = GAP_SYMPTOMS.map(s => `gap_${s.key}`);
const PART_E_COLUMNS = ["feedback_gap_helped", "feedback_comfortable", "easier_version", "other_comments"];

const ALL_COLUMNS = [
    ...PART_A_COLUMNS,
    ...SAGIS_SCORE_COLUMNS,
    ...SAGIS_YESNO_COLUMNS,
    ...SAGIS_TEXT_COLUMNS,
    ...GAP_SCORE_COLUMNS,
    ...PART_E_COLUMNS,
];

app.post("/submit", (req, res) => {
    const values = ALL_COLUMNS.map(col => {
        const v = req.body[col];
        return v === undefined ? null : v;
    });
    const placeholders = ALL_COLUMNS.map((_, i) => `$${i + 1}`).join(", ");
    const sql = `INSERT INTO responses (${ALL_COLUMNS.join(", ")}) VALUES (${placeholders})`;

    connection.query(sql, values, (err) => {
        if (err) {
            console.error("Error inserting data: " + err.stack);
            return res.status(500).send("Database error");
        }
        res.status(200).send("Survey submitted!");
    });
});

app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;
    connection.query("DELETE FROM responses WHERE id = $1", [id], (err) => {
        if (err) {
            console.error("Error deleting entry: " + err.stack);
            return res.status(500).send("Database error");
        }
        res.status(200).send("Entry deleted");
    });
});

app.delete("/clear", (req, res) => {
    connection.query("DELETE FROM responses", (err) => {
        if (err) {
            console.error("Error clearing database: " + err.stack);
            return res.status(500).send("Database error");
        }
        connection.query("ALTER SEQUENCE responses_id_seq RESTART WITH 1;", (err2) => {
            if (err2) {
                console.error("Error resetting sequence: " + err2.stack);
                return res.status(500).send("Database error");
            }
            res.status(200).send("All entries deleted and IDs reset");
        });
    });
});

// ---- Excel export ----
app.get("/export", async (req, res) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Responses");

        const columns = [
            { header: "ID", key: "id", width: 8 },
            { header: "Name/Initials", key: "name_initials", width: 15 },
            { header: "Sex", key: "sex", width: 10 },
            { header: "Age", key: "age", width: 8 },
            { header: "Race", key: "race", width: 12 },
            { header: "Race (Other)", key: "race_other", width: 12 },
            { header: "Education Level", key: "education_level", width: 18 },
            { header: "Contact Number", key: "contact_number", width: 15 },
            { header: "Smoking Status", key: "smoking_status", width: 15 },
            { header: "Wears Glasses/Lenses", key: "wears_glasses", width: 15 },
        ];

        SAGIS_SYMPTOMS.forEach(s => {
            columns.push({ header: `SAGIS: ${s.en} (0-4)`, key: `sagis_${s.key}`, width: 20 });
        });
        SAGIS_YESNO.forEach(item => {
            columns.push({ header: `SAGIS Y/N: ${item.en}`, key: `sagis_${item.key}`, width: 18 });
        });
        columns.push({ header: "SAGIS: Main concern", key: "sagis_main_concern", width: 30 });
        columns.push({ header: "SAGIS: Second concern", key: "sagis_second_concern", width: 30 });

        GAP_SYMPTOMS.forEach(s => {
            columns.push({ header: `GAP: ${s.en} (0-3)`, key: `gap_${s.key}`, width: 20 });
        });

        columns.push(
            { header: "Feedback: GAP helped more (1-5)", key: "feedback_gap_helped", width: 22 },
            { header: "Feedback: Comfortable using GAP (1-5)", key: "feedback_comfortable", width: 24 },
            { header: "Easier version", key: "easier_version", width: 15 },
            { header: "Other comments", key: "other_comments", width: 30 },
            { header: "Submission Date", key: "submission_date", width: 22 }
        );

        worksheet.columns = columns;

        connection.query("SELECT * FROM responses ORDER BY id", (err, results) => {
            if (err) {
                console.error("Export query error:", err);
                return res.status(500).send("Error generating export file");
            }

            results.rows.forEach(response => {
                const rowData = { ...response };
                SAGIS_YESNO.forEach(item => {
                    const col = `sagis_${item.key}`;
                    rowData[col] = response[col] === true ? "Yes" : response[col] === false ? "No" : "";
                });
                if (response.submission_date) {
                    rowData.submission_date = new Date(response.submission_date).toLocaleString();
                }
                worksheet.addRow(rowData);
            });

            res.setHeader("Content-Disposition", 'attachment; filename="sagis_gap_export.xlsx"');
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            workbook.xlsx.write(res).then(() => res.end());
        });
    } catch (error) {
        console.error("Export error:", error);
        res.status(500).send("Error generating export file");
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
