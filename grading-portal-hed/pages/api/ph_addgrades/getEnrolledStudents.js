import pool from "@/lib/db";

export default async function handler(req, res) {
  const { subjectId, semester } = req.query;

  try {
    // Get regular students (from the same department/year level)
    const [regularStudents] = await pool.query(`
      SELECT u.id, u.fullname, sg.midterm, sg.final, false as is_irregular
      FROM users u
      JOIN subjects s ON u.course = s.department AND u.year_level = s.year_level
      LEFT JOIN student_grades sg ON u.id = sg.student_id AND sg.subject_id = ?
      WHERE s.subject_id = ? AND s.semester = ?
    `, [subjectId, subjectId, semester]);

    // Get irregular students (assigned specifically to this subject)
    const [irregularStudents] = await pool.query(`
      SELECT u.id, u.fullname, sg.midterm, sg.final, true as is_irregular
      FROM irregular_student_subjects iss
      JOIN users u ON iss.student_id = u.id
      LEFT JOIN student_grades sg ON u.id = sg.student_id AND sg.subject_id = ?
      WHERE iss.subject_id = ? AND iss.semester = ?
    `, [subjectId, subjectId, semester]);

    // Combine both lists, removing duplicates
    const allStudents = [...regularStudents, ...irregularStudents];
    const uniqueStudents = allStudents.filter(
      (student, index, self) => index === self.findIndex(s => s.id === student.id)
    );

    res.json(uniqueStudents);
  } catch (error) {
    console.error("Error fetching enrolled students:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}