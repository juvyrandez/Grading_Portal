import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { id, fullname, email, username, password, course, year_level, gender, birthdate, contact_number, address } = req.body;

    try {
      // First get the current user data to compare passwords
      const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
      
      if (!user.length) {
        return res.status(404).json({ message: "Student not found" });
      }

      let query = `
        UPDATE users 
        SET fullname = ?, email = ?, username = ?, course = ?, year_level = ?, gender = ?, birthdate = ?, contact_number = ?, address = ?
        WHERE id = ?
      `;
      let values = [fullname, email, username, course, year_level, gender, birthdate, contact_number, address, id];

      // Only update password if it's provided and different from current
      if (password && password.trim() !== '') {
        // Check if the new password is different from current
        const isSamePassword = await bcrypt.compare(password, user[0].password);
        if (!isSamePassword) {
          const hashedPassword = await bcrypt.hash(password, 10);
          query = `
            UPDATE users 
            SET fullname = ?, email = ?, username = ?, password = ?, course = ?, year_level = ?, gender = ?, birthdate = ?, contact_number = ?, address = ?
            WHERE id = ?
          `;
          values = [fullname, email, username, hashedPassword, course, year_level, gender, birthdate, contact_number, address, id];
        }
      }

      await pool.query(query, values);

      return res.status(200).json({ message: "Student updated successfully" });
    } catch (error) {
      console.error("Error updating student:", error);
      return res.status(500).json({ message: "Failed to update student" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}