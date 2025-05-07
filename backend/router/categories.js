import express from "express";
import pool from "../config.js";
import throwError from "../utils/throwError.js";
import errorMessages from "../utils/errorMessages.js";
import multer from "multer";
import path from "path";
import uploadAndOptimizeImage from "../utils/uploadAndOptimizeImage.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM categories ORDER BY `order` DESC"
    );
    res.send(rows);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", upload.single("image"), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 0) throwError(errorMessages.BAD_REQUEST);

    const { content = null, name = null, visible = null } = req.body;
    let image_url = null;

    if (req.file) {
      const { secure_url } = await uploadAndOptimizeImage(req.file);
      image_url = secure_url;
    }

    let sql = `UPDATE categories SET`;
    const updates = [];
    const values = [];

    if (content !== null) {
      updates.push(`content = ?`);
      values.push(content);
    }
    if (image_url !== null) {
      updates.push(`image_url = ?`);
      values.push(image_url);
    }
    if (name !== null) {
      updates.push(`name = ?`);
      values.push(name);
    }
    if (visible !== null) {
      updates.push(`visible = ?`);
      values.push(visible === "1" ? 1 : 0);
    }

    if (updates.length === 0) {
      sql += ` content = NULL, name = NULL, image_url = NULL, visible = 1`;
    } else {
      sql += ` ${updates.join(", ")}`;
    }

    sql += ` WHERE id = ?`;
    values.push(id);

    await pool.execute(sql, values);

    res.send({ message: "Uspesno izmenjeno" });
  } catch (error) {
    console.log("Greska!");
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 0) throwError(errorMessages.BAD_REQUEST);

    const [result] = await pool.execute(`DELETE FROM categories WHERE id = ?`, [
      id,
    ]);

    if (result.affectedRows === 0) {
      throwError("Kategorija nije pronadjena");
    }

    res.send({ message: "Kategorija uspesno obrisana" });
  } catch (error) {
    console.log("Greska!");
    next(error);
  }
});

export default router;
