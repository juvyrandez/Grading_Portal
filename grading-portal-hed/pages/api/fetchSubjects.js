import pool from "@/lib/db";

export default async function handler(req, res) {
  const { department, yearLevel, semester } = req.query;

  try {
    const [rows] = await pool.query(
      "SELECT subject_code, subject_name, units FROM subjects WHERE department = ? AND year_level = ? AND semester = ?",
      [department, yearLevel, semester]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
}
