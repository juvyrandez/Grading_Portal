import pool from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { studentId } = req.query;

    try {
      const [rows] = await pool.query(
        "SELECT course, year_level FROM users WHERE id = ?",
        [studentId]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: "Student not found" });
      }

      res.status(200).json(rows[0]);
    } catch (error) {
      console.error("Error fetching student info:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}