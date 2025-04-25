import express from "express";
// import pool from "../config.js";
import { v2 as cloudinary } from "cloudinary";
import throwError from "../utils/throwError.js";
import errorMessages from "../utils/errorMessages.js";
import multer from "multer";

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

// TODO: proveriti na frontu kako se prikazuje slika, ovaj str-gavra-front da iskoristi
// TODO: dodati tabelu za mediju u bazu gde cu cuvati secure_url, kao i link ka lokalno sacuvanom fajlu, id slike i alt tekst (kako ce se generisati?)

router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) throwError(errorMessages.BAD_REQUEST);

    cloudinary.uploader
      .upload_stream(
        {
          public_id: undefined,
          resource_type: "image",
          folder: "navigation_images",
        },
        async (error, result) => {
          if (error)
            throw new Object.assign(
              new Error("Cloudinary upload fail: ", error.message),
              { status: error.http_code }
            );

          res.send({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
      )
      .end(req.file.buffer);
  } catch (error) {
    next(error);
  }
});

export default router;

// https://res.cloudinary.com/dlu5thalf/image/upload/q_10/v1745611801/navigation_images/zrxyxcm9vhkpv5inb0z2.png
