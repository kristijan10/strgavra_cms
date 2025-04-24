import express from "express";
import pool from "../config.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM products");
    res.send(rows);
  } catch (error) {
    next(error);
  }
});

export default router;
