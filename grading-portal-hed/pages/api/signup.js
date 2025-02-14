import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { fullname, email, username, password } = req.body;

    if (!fullname || !email || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const [existingUser] = await pool.query(
        "SELECT * FROM users WHERE email = ? OR username = ?",
        [email, username]
      );

      if (existingUser.length > 0) {
        return res.status(400).json({ message: "Email or username already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await pool.query(
        "INSERT INTO users (fullname, email, username, password) VALUES (?, ?, ?, ?)",
        [fullname, email, username, hashedPassword]
      );

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Database error", error });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
