const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "admin123",
    database: "mini_crm"
});

db.connect((err) => {
    if (err) {
        console.log("❌ MySQL Error:", err);
    } else {
        console.log("✅ MySQL Connected");
    }
});

// Get All Leads
app.get("/leads", (req, res) => {
    db.query("SELECT * FROM leads", (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
});

// Add Lead
app.post("/leads", (req, res) => {
    const { name, email, source, notes, status } = req.body;

    const sql =
        "INSERT INTO leads (name, email, source, notes, status) VALUES (?, ?, ?, ?, ?)";

    db.query(
        sql,
        [name, email, source, notes, status],
        (err, result) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json({
                    message: "Lead Added Successfully"
                });
            }
        }
    );
});

// Update Status
app.put("/leads/:id", (req, res) => {
    const id = req.params.id;
    const { status } = req.body;

    const sql = "UPDATE leads SET status = ? WHERE id = ?";

    db.query(sql, [status, id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({
                message: "Status Updated Successfully"
            });
        }
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
// Delete Lead
app.delete("/leads/:id", (req, res) => {
    const id = req.params.id;

    const sql = "DELETE FROM leads WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({
                message: "Lead Deleted Successfully"
            });
        }
    });
});