import pool from "@/lib/db";

export default async function handler(req, res) {
  const { studentId, semester } = req.query;

  if (!studentId || !semester) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    const [grades] = await pool.query(
      `
      SELECT 
        s.subject_code,
        s.subject_name,
        s.units,
        ss.midterm_grade,
        ss.final_grade
      FROM student_subjects ss
      JOIN subjects s ON ss.subject_id = s.subject_id
      WHERE ss.student_id = ? AND s.semester = ?
    `,
      [studentId, semester]
    );

    res.status(200).json({ grades });
  } catch (err) {
    console.error("Failed to fetch grades:", err);
    res.status(500).json({ error: "Failed to load grades" });
  }
}
