// server.js
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// เชื่อมต่อ MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root", // เปลี่ยนเป็น user ของคุณ
    password: "root", // ใส่รหัสผ่านของ MySQL ตรงนี้
    database: "mydatabase", // เปลี่ยนเป็นชื่อ database ของคุณ
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL database");
});

// API ดึงข้อมูลทั้งหมด
app.get("/items", (req, res) => {
    db.query("SELECT * FROM items", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// API เพิ่มข้อมูล
app.post("/items", (req, res) => {
    const { name, description } = req.body;
    db.query("INSERT INTO items (name, description) VALUES (?, ?)", [name, description],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: result.insertId, name, description });
        }
    );
});

// API แก้ไขข้อมูล
app.put("/items/:id", (req, res) => {
    const { name, description } = req.body;
    const { id } = req.params;
    db.query("UPDATE items SET name=?, description=? WHERE id=?", [name, description, id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Updated successfully" });
        }
    );
});

// API ลบข้อมูล
app.delete("/items/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM items WHERE id=?", [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Deleted successfully" });
    });
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
