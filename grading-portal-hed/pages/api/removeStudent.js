import pool from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "DELETE") return res.status(405).end();

  const { id } = req.query;

  try {
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json({ message: "Student removed successfully" });
  } catch (error) {
    console.error("Error removing student:", error);
    res.status(500).json({ error: "Failed to remove student" });
  }
}
