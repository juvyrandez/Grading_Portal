import pool from "@/lib/db";

export default async function handler(req, res) {
  const { studentId, semester } = req.query;

  if (!studentId) return res.status(400).json({ error: "Missing student ID" });

  try {
    let query = "SELECT * FROM grades WHERE student_id = ?";
    let values = [studentId];

    // Add semester filter if provided
    if (semester) {
      query += " AND semester = ?";
      values.push(semester);
    }

    const [results] = await pool.query(query, values);

    res.status(200).json({ grades: results });
  } catch (error) {
    console.error("Error fetching grades:", error);
    res.status(500).json({ error: "Failed to fetch grades" });
  }
}
