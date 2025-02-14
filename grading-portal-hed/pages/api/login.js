import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    try {
      const [user] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);

      if (user.length === 0) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      const validPassword = await bcrypt.compare(password, user[0].password);

      if (!validPassword) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      res.status(200).json({ message: "Login successful", user: user[0] });
    } catch (error) {
      res.status(500).json({ message: "Database error", error });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
