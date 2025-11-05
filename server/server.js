const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mysql = require("mysql2");
const multer = require("multer");
const fs = require("fs");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/api/post-item", upload.single("picture"), (req, res) => {
  const { type, itemName, place, date, personName, contact } = req.body;
  let picture = null;

  if (req.file) {
    picture = req.file.buffer;
  }

  const sql = `
    INSERT INTO items (type, item_name, place, date, picture, person_name, contact)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [type, itemName, place, date, picture, personName, contact],
    (err, result) => {
      if (err) {
        console.error("Error inserting data:", err);
        return res.status(500).json({ error: "Database insertion failed" });
      }
      res.status(200).json({ message: "Item submitted successfully", id: result.insertId });
    }
  );
});

app.get("/api/found-items", (req, res) => {
  const sql = "SELECT * FROM items WHERE type = 'found' ORDER BY created_at DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching found items:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    const formattedResults = results.map((item) => ({
      id: item.id,
      name: item.item_name,
      description: `Found at ${item.place} on ${new Date(item.date).toLocaleString()}`,
      image: item.picture ? `data:image/jpeg;base64,${item.picture.toString("base64")}` : null,
    }));

    res.json(formattedResults);
  });
});

app.get("/api/item/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM items WHERE id = ?";

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error fetching item:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    if (results.length === 0) return res.status(404).json({ error: "Item not found" });

    const item = results[0];
    const formattedItem = {
      ...item,
      picture: item.picture ? item.picture.toString("base64") : null,
    };

    res.json(formattedItem);
  });
});

app.get("/api/recent-items", (req, res) => {
  const sql = "SELECT * FROM items ORDER BY created_at DESC LIMIT 10";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching recent items:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    const formattedResults = results.map((item) => ({
      id: item.id,
      name: item.item_name,
      type: item.type,
      description: `${item.type === "found" ? "Found at" : "Lost at"} ${
        item.place
      } on ${new Date(item.date).toLocaleString()}`,
      image: item.picture
        ? `data:image/jpeg;base64,${item.picture.toString("base64")}`
        : null,
    }));

    res.json(formattedResults);
  });
});

app.get("/api/lost-items", (req, res) => {
  const sql = "SELECT * FROM items WHERE type = 'lost' ORDER BY created_at DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching lost items:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    const formattedResults = results.map((item) => ({
      id: item.id,
      name: item.item_name,
      description: `Lost at ${item.place} on ${new Date(item.date).toLocaleString()}`,
      image: item.picture ? `data:image/jpeg;base64,${item.picture.toString("base64")}` : null,
    }));

    res.json(formattedResults);
  });
});











app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});