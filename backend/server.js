// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require("bcryptjs");
const db = require("./db");

const app = express();
app.use(express.static(path.join(__dirname, "../frontend")));
app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Ensure data dir and orders file exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(ORDERS_FILE)) fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2));

// Load products (synchronous is fine for small demo)
let products = [];
try {
  products = JSON.parse(fs.readFileSync(PRODUCTS_FILE));
} catch (err) {
  console.warn('Could not read products.json — make sure data/products.json exists.');
  products = [];
}
app.post("/api/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashedPassword],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Registration failed" });
      }
      res.json({ message: "User registered successfully" });
    }
  );
});

// ===========
// User Login
// ===========
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Login error" });

    if (results.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    const user = results[0];
    try {
      // Compare given password with hashed password in DB
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid password" });
      }

      // ✅ Success
      res.json({
        message: "Login successful",
        userId: user.id, // this will be stored in localStorage for checkout
        name: user.name
      });
    } catch (err) {
      console.error("❌ Password compare error:", err);
      res.status(500).json({ error: "Login failed" });
    }
  });
});

// ===================
// Save Orders (Checkout)
// ===================
app.post("/api/orders", (req, res) => {
  const { userId, productName, quantity, totalPrice } = req.body;

  db.query(
    "INSERT INTO orders (user_id, product_name, quantity, total_price) VALUES (?, ?, ?, ?)",
    [userId, productName, quantity, totalPrice],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Order failed" });
      }
      res.json({ message: "Order placed successfully" });
    }
  );
});

// const PORT = 5002;
// app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));

// Simple GET products
app.get("/api/products", (req, res) => {
  const products = JSON.parse(
    fs.readFileSync(path.join(__dirname, "data", "products.json"))
  );
  res.json(products);
});

// POST order
app.post('/api/orders', (req, res) => {
  const order = req.body;
  if (!order || !Array.isArray(order.items) || order.items.length === 0) {
    return res.status(400).json({ error: 'Order must include items' });
  }

  const orders = JSON.parse(fs.readFileSync(ORDERS_FILE));
  order.id = Date.now();
  order.createdAt = new Date().toISOString();
  orders.push(order);
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));

  res.json({ message: 'Order placed', orderId: order.id });
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Fallback to index.html for client-side routes (simple)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

const PORT = 5002;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));


