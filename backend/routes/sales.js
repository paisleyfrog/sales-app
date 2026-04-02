const express = require("express");
const ExcelJS = require("exceljs");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// Path to Excel file
const filePath = "./data/sales.xlsx";

// Add Sale (Salespeople only)
router.post("/add", authMiddleware, async (req, res) => {
  if (req.user.role !== "sales")
    return res.status(403).json({ error: "Access denied" });

  const { date, customer, product, amount, notes } = req.body;

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.getWorksheet(1);

  sheet.addRow([
    date,
    customer,
    product,
    amount,
    notes,
    req.user.username,
    new Date()
  ]);

  await workbook.xlsx.writeFile(filePath);

  res.json({ success: true });
});

// Supervisor: Get all sales
router.get("/all", authMiddleware, async (req, res) => {
  if (req.user.role !== "supervisor")
    return res.status(403).json({ error: "Access denied" });

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.getWorksheet(1);

  const rows = sheet.getSheetValues().slice(2); // skip header
  res.json(rows);
});

module.exports = router;
