import pool from "@/lib/db";

export default async function handler(req, res) {
  const { department, yearLevel } = req.query;
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE course = ? AND year_level = ? AND user_type = 'user'",
    [department, yearLevel]
  );
  res.json(rows);
}
