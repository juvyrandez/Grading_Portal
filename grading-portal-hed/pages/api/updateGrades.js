import pool from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { studentId, grades } = req.body;

  if (!studentId || !grades) return res.status(400).json({ error: "Missing data" });

  try {
    for (const grade of grades) {
      const { subject_code, subject_description, units, midterm_grade, final_grade, remarks, semester } = grade;

      await pool.query(
        `UPDATE grades 
         SET subject_code = ?, subject_description = ?, units = ?, midterm_grade = ?, final_grade = ?, remarks = ?
         WHERE student_id = ? AND semester = ?`,
        [subject_code, subject_description, units, midterm_grade, final_grade, remarks, studentId, semester]
      );
    }

    res.status(200).json({ message: "Grades updated successfully" });
  } catch (error) {
    console.error("Error updating grades:", error);
    res.status(500).json({ error: "Failed to update grades" });
  }
}
