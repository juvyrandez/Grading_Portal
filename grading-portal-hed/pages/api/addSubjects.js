import pool from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { department, yearLevel, semester, subjects } = req.body;

    try {
      const connection = await pool.getConnection();

      // Insert each subject
      for (const subject of subjects) {
        const { subjectCode, subjectName, units } = subject;

        await connection.query(
          `INSERT INTO subjects (department, year_level, semester, subject_code, subject_name, units)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [department, yearLevel, semester, subjectCode, subjectName, units]
        );
      }

      connection.release();
      res.status(200).json({ success: true, message: "Subjects added successfully!" });
    } catch (error) {
      console.error("Error inserting subjects:", error);
      res.status(500).json({ success: false, message: "Failed to add subjects" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
