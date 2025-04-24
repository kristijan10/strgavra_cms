import express from "express";
import pool from "../config.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, title, subtitle, image_url, button_text, button_url FROM hero"
    );
    res.send(rows);
  } catch (error) {
    next(error);
  }
});

export default router;
