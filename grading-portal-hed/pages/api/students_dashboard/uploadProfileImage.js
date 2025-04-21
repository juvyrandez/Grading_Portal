import multer from "multer";
import path from "path";
import pool from "@/lib/db";

// Configure multer storage
const storage = multer.diskStorage({
  destination: "public/uploads/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `profile_${Date.now()}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

// Next.js API handler wrapped with multer
export const config = { api: { bodyParser: false } };

export default function handler(req, res) {
  upload.single("image")(req, res, async (err) => {
    if (err) return res.status(500).json({ error: "Image upload failed" });

    const { studentId } = req.body;
    const imageUrl = req.file.filename;

    try {
      // Update the user's profile image in the database
      const [result] = await pool.query(
        `UPDATE users SET profile_img = ? WHERE id = ?`,
        [imageUrl, studentId]
      );

      if (result.affectedRows === 0) return res.status(404).json({ error: "Student not found" });

      res.status(200).json({ profile_img: imageUrl });
    } catch (dbErr) {
      console.error("Error updating profile image:", dbErr);
      res.status(500).json({ error: "Failed to update profile image" });
    }
  });
}
