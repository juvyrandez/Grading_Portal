import pool from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const { year_level, department } = req.query;

  try {
    const [students] = await pool.query(
      "SELECT * FROM users WHERE course = ? AND year_level = ? AND status = 'Active'",
      [department, year_level]
    );

    res.status(200).json({ students });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
}
