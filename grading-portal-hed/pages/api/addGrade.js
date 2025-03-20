import pool from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { studentId, subjectCode, description, units, midterm, final, remarks, semester } = req.body;

  try {
    await pool.query(
      `INSERT INTO grades (student_id, subject_code, subject_description, units, midterm_grade, final_grade, remarks, semester)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [studentId, subjectCode, description, units, midterm, final, remarks, semester]
    );

    res.status(200).json({ message: "Grade added successfully!" });
  } catch (error) {
    console.error("Error adding grade:", error);
    res.status(500).json({ error: "Failed to add grade" });
  }
}
