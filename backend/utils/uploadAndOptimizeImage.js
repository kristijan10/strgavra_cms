import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";

export default async (file) => {
  if (!file) throw new Error("Nema upload-ovane slike");

  // Optimizacija slike pomoću Sharp-a
  const optimizedImage = await sharp(file.path)
    .resize({
      width: 1200,
      height: 1200,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 80 })
    .toBuffer();

  // Upload na Cloudinary
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "image",
          folder: "navigation_images",
          format: "webp",
        },
        (error, result) => {
          if (error) {
            reject(new Error("Cloudinary upload neuspešan: " + error.message));
          } else {
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          }
        }
      )
      .end(optimizedImage);
  });
};
