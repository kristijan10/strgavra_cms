import express from "express";
import pool from "../config.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, name, url FROM navigation ORDER BY `order` DESC"
    );
    res.send(rows);
  } catch (error) {
    next(error);
  }
});

export default router;
