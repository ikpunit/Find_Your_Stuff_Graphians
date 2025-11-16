const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mysql = require("mysql2");
const multer = require("multer");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// -------------------------------
// 🚀 MySQL Connection (Railway Ready)
// -------------------------------
const db = mysql.createPool({
  host: process.env.DB_HOST,        // auto-injected from Railway
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,        // important for Railway
  connectionLimit: 10,
});

// Test connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL Connection Error:", err);
  } else {
    console.log("✅ Connected to MySQL Database");
    connection.release();
  }
});

// -------------------------------
// 🚀 Create TABLE if it doesn't exist
// -------------------------------
const createTableQuery = `
CREATE TABLE IF NOT EXISTS items (
  id INT(11) NOT NULL AUTO_INCREMENT,
  type ENUM('lost', 'found') NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  place VARCHAR(255) NOT NULL,
  date DATETIME NOT NULL,
  picture LONGBLOB DEFAULT NULL,
  person_name VARCHAR(255) NOT NULL,
  contact VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
`;

db.query(createTableQuery, (err) => {
  if (err) {
    console.error("❌ Error creating items table:", err);
  } else {
    console.log("✅ items table is ready");
  }
});


// -------------------------------
// File Upload Handling
// -------------------------------
const storage = multer.memoryStorage();
const upload = multer({ storage });

// -------------------------------
// Routes
// -------------------------------
app.get("/", (req, res) => {
  res.send("Server is running on Railway!");
});

// POST ITEM
app.post("/api/post-item", upload.single("picture"), (req, res) => {
  const { type, itemName, place, date, personName, contact } = req.body;
  let picture = req.file ? req.file.buffer : null;

  const sql = `
    INSERT INTO items (type, item_name, place, date, picture, person_name, contact)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [type, itemName, place, date, picture, personName, contact],
    (err, result) => {
      if (err) {
        console.error("❌ Error inserting data:", err);
        return res.status(500).json({ error: "Database insertion failed" });
      }
      res.status(200).json({ message: "Item submitted successfully", id: result.insertId });
    }
  );
});

// FOUND ITEMS
app.get("/api/found-items", (req, res) => {
  const sql = "SELECT * FROM items WHERE type = 'found' ORDER BY created_at DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching found items:", err);
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

// SINGLE ITEM
app.get("/api/item/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM items WHERE id = ?";

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("❌ Error fetching item:", err);
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

// RECENT ITEMS
app.get("/api/recent-items", (req, res) => {
  const sql = "SELECT * FROM items ORDER BY created_at DESC LIMIT 10";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching recent items:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    const formattedResults = results.map((item) => ({
      id: item.id,
      name: item.item_name,
      type: item.type,
      description: `${item.type === "found" ? "Found at" : "Lost at"} ${item.place} on ${new Date(item.date).toLocaleString()}`,
      image: item.picture ? `data:image/jpeg;base64,${item.picture.toString("base64")}` : null,
    }));

    res.json(formattedResults);
  });
});

// LOST ITEMS
app.get("/api/lost-items", (req, res) => {
  const sql = "SELECT * FROM items WHERE type = 'lost' ORDER BY created_at DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching lost items:", err);
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

// -------------------------------
// Start Server
// -------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});