import express from "express";
const router = express.Router();
import db from "../db.js";


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

export default router;
