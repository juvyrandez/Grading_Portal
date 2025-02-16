import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    try {
      const [users] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);

      if (users.length === 0) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      const user = users[0]; // Get the first user from the query result
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      res.status(200).json({
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          user_type: user.user_type, // Ensure correct column name
        },
      });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ message: "Database error", error });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
