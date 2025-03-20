import pool from "@/lib/db";

export default async function handler(req, res) {
  const { studentId } = req.query;

  if (!studentId) return res.status(400).json({ error: "Missing student ID" });

  try {
    const [results] = await pool.query(
      "SELECT * FROM grades WHERE student_id = ? ORDER BY semester",
      [studentId]
    );

    res.status(200).json({ grades: results });
  } catch (error) {
    console.error("Error fetching grades:", error);
    res.status(500).json({ error: "Failed to fetch grades" });
  }
}
