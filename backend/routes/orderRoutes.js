const express = require("express");
const router = express.Router();

let orders = [];

router.post("/", (req, res) => {
  const order = req.body;
  orders.push(order);
  res.json({ message: "Order placed successfully!", order });
});

module.exports = router;
