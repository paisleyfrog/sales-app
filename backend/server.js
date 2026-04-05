const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const salesRoutes = require("./routes/sales");

app.use("/auth", authRoutes);
app.use("/sales", salesRoutes);
app.get("/sales/team-summary", authenticateToken, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile("sales.xlsx");
    const sheet = workbook.getWorksheet(1);

    const today = new Date();
    const todayMonth = today.getMonth();
    const todayDate = today.getDate();
    const todayYear = today.getFullYear();

    const summary = {};

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // skip header

      const dateStr = row.getCell("A").value; // Date column
      const customer = row.getCell("B").value;
      const product = row.getCell("C").value;
      const amount = Number(row.getCell("D").value);
      const salesperson = row.getCell("E").value;
      const timestamp = row.getCell("F").value;

      const saleDate = new Date(dateStr);

      if (!summary[salesperson]) {
        summary[salesperson] = {
          countToday: 0,
          amountToday: 0,
          countMonth: 0,
          amountMonth: 0,
          lastTimestamp: null
        };
      }

      // Daily totals
      if (
        saleDate.getDate() === todayDate &&
        saleDate.getMonth() === todayMonth &&
        saleDate.getFullYear() === todayYear
      ) {
        summary[salesperson].countToday++;
        summary[salesperson].amountToday += amount;
      }

      // Monthly totals
      if (
        saleDate.getMonth() === todayMonth &&
        saleDate.getFullYear() === todayYear
      ) {
        summary[salesperson].countMonth++;
        summary[salesperson].amountMonth += amount;
      }

      // Last activity
      if (timestamp) {
        const ts = new Date(timestamp);
        if (!summary[salesperson].lastTimestamp || ts > summary[salesperson].lastTimestamp) {
          summary[salesperson].lastTimestamp = ts;
        }
      }
    });

    // Role-based filtering
    if (req.user.role === "salesperson") {
      // Remove timestamps for salespeople
      Object.values(summary).forEach(s => delete s.lastTimestamp);
    }

    res.json(summary);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate team summary" });
  }
});


app.listen(3000, () => console.log("Backend running on port 3000"));
