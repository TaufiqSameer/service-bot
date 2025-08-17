import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import robotRoutes from "./routes/robot.js";
import db from "./db.js"; // ✅ single shared DB connection

dotenv.config();

const app = express();
const port = 3000;

// Middleware for forms and JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // <-- needed for Flutter POST requests
app.use(express.static("public"));
app.set("view engine", "ejs");

// Routes
app.use("/", robotRoutes);

// Example health check API (for Flutter)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running fine 🚀" });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
