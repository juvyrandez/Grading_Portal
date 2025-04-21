import pool from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { studentId, semester } = req.query;

    try {
      const [subjects] = await pool.query(`
        SELECT s.subject_id, s.subject_code, s.subject_name, s.units,
               sg.midterm, sg.final, sg.remarks
        FROM irregular_student_subjects iss
        JOIN subjects s ON iss.subject_id = s.subject_id
        LEFT JOIN student_grades sg 
          ON s.subject_id = sg.subject_id AND sg.student_id = ?
        WHERE iss.student_id = ? AND iss.semester = ?
      `, [studentId, studentId, semester]);

      res.status(200).json(subjects);
    } catch (error) {
      console.error("Error fetching irregular subjects:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}