const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const SECRET = "yoursecretkey";

// Hardcoded users for now
const users = [
  { username: "sales1", password: "pass1", role: "sales" },
  { username: "sales2", password: "pass2", role: "sales" },
  { username: "sales3", password: "pass3", role: "sales" },
  { username: "sales4", password: "pass4", role: "sales" },
  { username: "sales5", password: "pass5", role: "sales" },
  { username: "sales6", password: "pass6", role: "sales" },
  { username: "sales7", password: "pass7", role: "sales" },
  { username: "sales8", password: "pass8", role: "sales" },
  { username: "supervisor", password: "admin123", role: "supervisor" }
];

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { username: user.username, role: user.role },
    SECRET,
    { expiresIn: "8h" }
  );

  res.json({ token, role: user.role });
});

module.exports = router;
