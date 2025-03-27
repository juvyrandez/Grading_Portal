import pool from "@/lib/db";

export default async function handler(req, res) {
  const { department, yearLevel, semester } = req.query;
  const [rows] = await pool.query(
    "SELECT * FROM subjects WHERE department = ? AND year_level = ? AND semester = ?",
    [department, yearLevel, semester]
  );
  res.json(rows);
}
