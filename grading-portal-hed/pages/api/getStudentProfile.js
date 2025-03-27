import pool from "@/lib/db";

export default async function handler(req, res) {
  const { studentId } = req.query;

  if (!studentId) return res.status(400).json({ error: "Student ID is required" });

  try {
    const [result] = await pool.query(
      `SELECT fullname, email, course, year_level, gender, birthdate, contact_number, address, status, profile_img
      FROM users 
      WHERE id = ? AND user_type = 'user'`,
      [studentId]
    );

    if (result.length === 0) return res.status(404).json({ error: "Student not found" });

    res.status(200).json(result[0]);
  } catch (err) {
    console.error("Error fetching student profile:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
