import express from "express";
import pool from "../config.js";
import { v2 as cloudinary } from "cloudinary";
import throwError from "../utils/throwError.js";
import errorMessages from "../utils/errorMessages.js";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/svg+xml"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, and SVG images are allowed"));
    }
  },
});

const uploadDir = path.join(process.cwd(), "uploads");
fs.mkdir(uploadDir, { recursive: true }).catch((err) =>
  console.error("Error creating uploads directory:", err)
);

router.use("/uploads", express.static(uploadDir));

router.post("/", upload.single("image"), async (req, res, next) => {
  let localPath;
  try {
    if (!req.file) throwError(errorMessages.BAD_REQUEST);

    const optimizedImage = await sharp(req.file.buffer)
      .resize({
        width: 1200,
        height: 1200,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toBuffer();

    const filename = `image-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 9)}.webp`;
    localPath = path.join("uploads", filename);

    // cuva lokalno
    // await fs.writeFile(path.join(process.cwd(), localPath), optimizedImage);

    cloudinary.uploader
      .upload_stream(
        {
          public_id: undefined,
          resource_type: "image",
          folder: "navigation_images",
          format: "webp",
        },
        async (error, result) => {
          if (error)
            throw new Object.assign(
              new Error("Cloudinary upload fail: ", error.message),
              { status: error.http_code }
            );

          const alt_text = "strgavra logo, vatra";

          const sql = `INSERT INTO images(url, public_id, local_path, alt_text) VALUES(?, ?, ?, ?)`;
          await pool.execute(sql, [
            result.secure_url,
            result.public_id,
            localPath,
            alt_text,
          ]);

          res.send({
            secure_url: result.secure_url,
            local_path: localPath,
            alt_text,
          });
        }
      )
      .end(optimizedImage);
  } catch (error) {
    if (localPath)
      await fs.unlink(path.join(process.cwd(), localPath)).catch(() => {});

    next(error);
  }
});

export default router;

// https://res.cloudinary.com/dlu5thalf/image/upload/q_10/v1745611801/navigation_images/zrxyxcm9vhkpv5inb0z2.png
