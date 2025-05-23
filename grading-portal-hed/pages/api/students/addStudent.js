import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

  try {
    const { first_name, middle_name, last_name, email, username, password, course, year_level, gender, birthdate, contact_number, address } = req.body;

    // Combine names into fullname
    const fullname = `${first_name} ${middle_name ? middle_name + " " : ""}${last_name}`.trim();

    // Check if user already exists
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ? OR username = ?", [email, username]);
    if (rows.length > 0) {
      return res.status(400).json({ message: "Email or username is already in use" });
    }

    // Get active school year
    const [activeYear] = await pool.query("SELECT id FROM school_years WHERE status = 'Active' LIMIT 1");
    if (!activeYear.length) {
      return res.status(400).json({ message: "No active school year found" });
    }
    const schoolYearId = activeYear[0].id;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert student into the database
    await pool.query(
      "INSERT INTO users (school_year_id, fullname, email, username, password, course, year_level, gender, birthdate, contact_number, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [schoolYearId, fullname, email, username, hashedPassword, course, year_level, gender, birthdate, contact_number, address]
    );

    res.status(201).json({ message: "Student added successfully" });
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}