import pool from "@/lib/db";

export default async function handler(req, res) {
  try {
    const [students] = await pool.query("SELECT COUNT(*) AS count FROM users WHERE user_type = 'user'");
    const [programHeads] = await pool.query("SELECT COUNT(*) AS count FROM program_head WHERE status = 'Active'");
    const [subjects] = await pool.query("SELECT COUNT(*) AS count FROM subjects");

    res.status(200).json({
      students: students[0].count,
      programHeads: programHeads[0].count,
      subjects: subjects[0].count,
    });
  } catch (error) {
    console.error("Failed to fetch counts:", error);
    res.status(500).json({ error: "Failed to load counts" });
  }
}
