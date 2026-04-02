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

app.listen(3000, () => console.log("Backend running on port 3000"));
