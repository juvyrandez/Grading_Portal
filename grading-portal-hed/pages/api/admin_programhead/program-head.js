import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const [programHeads] = await pool.query(
        "SELECT id, name, email, department, department_type, status FROM program_head"
      );
      res.status(200).json(programHeads);
    }

    // Add new Program Head
    else if (req.method === "POST") {
      const { name, email, password, department, department_type, status } = req.body;

      // Check if email already exists
      const [existingUser] = await pool.query("SELECT * FROM program_head WHERE email = ?", [email]);
      if (existingUser.length > 0) return res.status(400).json({ message: "Email already in use" });

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new program head
      await pool.query(
        "INSERT INTO program_head (name, email, password, department, department_type, status) VALUES (?, ?, ?, ?, ?, ?)",
        [name, email, hashedPassword, department, department_type, status]
      );

      res.status(201).json({ message: "Program Head added successfully" });
    }

    // Edit existing Program Head
    else if (req.method === "PUT") {
      const { id, name, email, department, department_type, status, newPassword } = req.body;

      let updateQuery = `
        UPDATE program_head 
        SET name = ?, email = ?, department = ?, department_type = ?, status = ?`;

      const params = [name, email, department, department_type, status];

      // If new password is provided, hash it and update
      if (newPassword && newPassword.trim() !== "") {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        updateQuery += `, password = ?`;
        params.push(hashedPassword);
      }

      updateQuery += ` WHERE id = ?`;
      params.push(id);

      const [result] = await pool.query(updateQuery, params);

      if (result.affectedRows === 0) return res.status(404).json({ message: "Program Head not found" });

      res.status(200).json({ message: "Program Head updated successfully" });
    }

    // Delete Program Head
    else if (req.method === "DELETE") {
      const { id } = req.query;

      const [result] = await pool.query("DELETE FROM program_head WHERE id = ?", [id]);
      if (result.affectedRows === 0) return res.status(404).json({ message: "Program Head not found" });

      res.status(200).json({ message: "Program Head deleted successfully" });
    }

    // For unsupported methods
    else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error handling data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
