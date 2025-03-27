import pool from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { studentId, semester } = req.query;

    try {
      // Fetch student course and year level
      const [userResult] = await pool.query(
        "SELECT course, year_level FROM users WHERE id = ?",
        [studentId]
      );

      if (userResult.length === 0)
        return res.status(404).json({ message: "Student not found" });

      const { course, year_level } = userResult[0];

      // Fetch subjects with student-specific grades
      const [subjects] = await pool.query(
        `SELECT s.subject_id, s.subject_code, s.subject_name, s.units,
                sg.midterm, sg.final, sg.remarks
         FROM subjects s
         LEFT JOIN student_grades sg 
         ON s.subject_id = sg.subject_id AND sg.student_id = ?
         WHERE s.department = ? AND s.year_level = ? AND s.semester = ?`,
        [studentId, course, year_level, semester]
      );

      res.status(200).json(subjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
