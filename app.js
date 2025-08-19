import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";

import robotRoutes from "./routes/robot.js";
import db from "./db.js"; // ✅ single shared DB connection



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

// Node.js example (Express)
app.get("/config", (req, res) => {
  res.json({ googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY });
});


// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
