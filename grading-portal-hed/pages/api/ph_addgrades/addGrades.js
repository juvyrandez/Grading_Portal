import pool from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { subject, semester, grades } = req.body;

  try {
    for (const studentId in grades) {
      const { midterm, final, general, remarks, is_irregular } = grades[studentId];

      // Check if grades already exist for this student and subject
      const [existingGrades] = await pool.query(
        `SELECT * FROM student_grades WHERE student_id = ? AND subject_id = ?`,
        [studentId, subject.subject_id]
      );

      if (existingGrades.length > 0) {
        // Update existing grades
        await pool.query(
          `UPDATE student_grades 
           SET midterm = ?, final = ?, general = ?, remarks = ?, is_irregular = ?
           WHERE student_id = ? AND subject_id = ?`,
          [
            midterm || existingGrades[0].midterm,
            final || existingGrades[0].final,
            general || existingGrades[0].general,
            remarks || existingGrades[0].remarks,
            is_irregular,
            studentId,
            subject.subject_id
          ]
        );
      } else {
        // Insert new grades
        await pool.query(
          `INSERT INTO student_grades 
           (student_id, subject_id, midterm, final, general, remarks, is_irregular)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            studentId,
            subject.subject_id,
            midterm || null,
            final || null,
            general || null,
            remarks,
            is_irregular
          ]
        );
      }
    }

    res.json({ message: "Grades updated successfully!" });
  } catch (err) {
    console.error("Error updating grades:", err);
    res.status(500).json({ message: "Failed to update grades." });
  }
}