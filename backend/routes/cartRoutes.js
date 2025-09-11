const express = require("express");
const router = express.Router();

let cart = [];

// Get cart
router.get("/", (req, res) => {
  res.json(cart);
});

// Add item
router.post("/", (req, res) => {
  const item = req.body;
  cart.push(item);
  res.json({ message: "Item added to cart", cart });
});

// Clear cart
router.delete("/", (req, res) => {
  cart = [];
  res.json({ message: "Cart cleared" });
});

module.exports = router;
