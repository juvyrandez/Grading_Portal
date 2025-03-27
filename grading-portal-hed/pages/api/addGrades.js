import pool from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { subject, semester, grades } = req.body;

  try {
    for (const studentId in grades) {
      const { midterm, final } = grades[studentId];

      // Fetch student name based on student ID
      const [studentInfo] = await pool.query(`SELECT fullname FROM users WHERE id = ?`, [studentId]);
      const studentName = studentInfo.length > 0 ? studentInfo[0].fullname : `Student ID: ${studentId}`;

      // Check if grades already exist for this student and subject
      const [existingGrades] = await pool.query(
        `SELECT * FROM student_grades WHERE student_id = ? AND subject_id = ?`,
        [studentId, subject.subject_id]
      );

      // If midterm exists but final is missing, allow updating final only
      if (existingGrades.length > 0) {
        const existingGrade = existingGrades[0];
        if (existingGrade.final === null && final !== "") {
          await pool.query(
            `UPDATE student_grades SET final = ?, remarks = ? WHERE student_id = ? AND subject_id = ?`,
            [final, final <= 3.0 && existingGrade.midterm <= 3.0 ? "Passed" : "Failed", studentId, subject.subject_id]
          );

          continue; // Move to the next student
        }

        return res.status(400).json({
          message: `Grades for ${studentName} in ${subject.subject_name} already exist!`,
        });
      }

      // Add new grades (midterm or final can be empty initially)
      const remarks = midterm !== "" && final !== "" && midterm <= 3.0 && final <= 3.0 ? "Passed" : "Failed";

      await pool.query(
        `INSERT INTO student_grades (student_id, subject_id, midterm, final, remarks)
         VALUES (?, ?, ?, ?, ?)`,
        [studentId, subject.subject_id, midterm || null, final || null, remarks]
      );
    }

    res.json({ message: "Grades added successfully!" });
  } catch (err) {
    console.error("Error updating grades:", err);
    res.status(500).json({ message: "Failed to update grades." });
  }
}
