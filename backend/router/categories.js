import express from "express";
import pool from "../config.js";
import throwError from "../utils/throwError.js";
import errorMessages from "../utils/errorMessages.js";
import multer from "multer";
import path from "path";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Adjust the path to your desired directory
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

    const { content, name = null } = req.body; // Extract content from formData
    const imagePath = req.file ? req.file.path : null; // Get file path if uploaded

    const sql = `UPDATE categories SET content = ? 
    ${imagePath ? ", image_url = ?" : ""} ${name ? ", name = ?" : ""}
     WHERE id = ?`;
    const values = [content];
    if (imagePath) values.push(imagePath);
    if (name) values.push(name);
    values.push(id);

    await pool.execute(sql, values);

    res.send({ message: "Uspesno izmenjeno" });
  } catch (error) {
    console.log("Greska!");
    next(error);
  }
});

export default router;
