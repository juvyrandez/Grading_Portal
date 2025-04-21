import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { username, password } = req.body;

  try {
    let user = null;

    // Check 'users' table first (for users/admins)
    const [users] = await pool.query(
      "SELECT * FROM users WHERE (username = ? OR email = ?)",
      [username, username]
    );

    if (users.length > 0) {
      const validPassword = await bcrypt.compare(password, users[0].password);

      if (validPassword) {
        user = { ...users[0], user_type: users[0].user_type }; // User or admin found
      }
    }

    // If not found in 'users', check 'program_head' table
    if (!user) {
      const [programHeads] = await pool.query("SELECT * FROM program_head WHERE email = ?", [username]);

      if (programHeads.length > 0) {
        const validPassword = await bcrypt.compare(password, programHeads[0].password);

        if (validPassword) {
          user = { 
            ...programHeads[0], 
            user_type: "programhead", 
            username: programHeads[0].name // Use 'name' as username for program heads
          };
        }
      }
    }

    // If no valid user/program head found
    if (!user) return res.status(401).json({ message: "Invalid username or password" });

    // Successful login
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        user_type: user.user_type,
        department: user.department || null, // Store department if it's a program head
      },
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Database error", error });
  }
}
