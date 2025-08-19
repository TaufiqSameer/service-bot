import express from "express";
const router = express.Router();
import db from "../db.js";

// ---------------- Website Routes ----------------

router.get('/', async (req, res) => {
  try {
    const statusResult = await db.query('SELECT * FROM robot_status ORDER BY id DESC');
    const ordersResult = await db.query('SELECT * FROM robot_orders ORDER BY id DESC LIMIT 5');

    res.render('index', {
      data: statusResult.rows,
      orders: ordersResult.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.post("/move", async (req, res) => {
  try {
    await db.query(
      "INSERT INTO robot_orders (task, destination) VALUES ($1, $2)",
      ["move", "autonomous"]
    );
    res.redirect("/");
  } catch (err) {
    console.error("Error triggering move command:", err);
    res.status(500).send("Failed to trigger robot movement");
  }
});

router.post("/order", async (req, res) => {
  const { task, destination } = req.body;
  try {
    await db.query(
      "INSERT INTO robot_orders (task, destination) VALUES ($1, $2)",
      [task, destination]
    );
    res.redirect("/");
  } catch (err) {
    console.error("Error inserting order:", err);
    res.status(500).send("Failed to insert robot order");
  }
});

router.get('/logs', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM robot_status ORDER BY id DESC');
    res.render('logs', { data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading logs');
  }
});

router.get("/about", (req, res) => {
  res.render("about");
});

// ---------------- Flutter API Routes ----------------

// Get robot status (JSON)
router.get('/api/status', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM robot_status ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch status" });
  }
});

// Get robot logs (JSON)
router.get('/api/logs', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM robot_status ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

// Get recent orders (JSON)
router.get('/api/orders', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM robot_orders ORDER BY id DESC LIMIT 5');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.post('/api/move', async (req, res) => {
  try {
    await db.query(
      "INSERT INTO robot_orders (task, destination) VALUES ($1, $2)",
      ["move", "autonomous"]
    );
    res.json({ success: true, message: "Robot moving" });
  } catch (err) {
    console.error("Error triggering move command:", err);
    res.status(500).json({ success: false, message: "Failed to move robot" });
  }
});

// Add a new order (JSON)
router.post('/api/order', async (req, res) => {
  const { task, destination } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO robot_orders (task, destination) VALUES ($1, $2) RETURNING *",
      [task, destination]
    );
    res.json({ success: true, order: result.rows[0] });
  } catch (err) {
    console.error("Error inserting order:", err);
    res.status(500).json({ error: "Failed to insert robot order" });
  }
});

// Get team members (JSON)
router.get('/api/team', async (req, res) => {
  try {
    // If you want to store in DB -> SELECT * FROM team_members
    // For now, send static JSON like Flutter
    const team = [
    { name: "Mohammad Taufeeq Sameer", image: "/images/sameer.jpg" },
    { name: "Bhavana", image: "/images/bhavana.jpg" },
    { name: "Sreeja", image: "/images/Sreeja.jpg" },
    { name: "Harsha", image: "/images/harsha.jpg" }
];

    res.json(team);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch team" });
  }
});

export default router;
