import pool from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { id } = req.query;

    try {
      const query = "DELETE FROM users WHERE id = ?";
      await pool.query(query, [id]);

      return res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
      console.error("Error deleting student:", error);
      return res.status(500).json({ message: "Failed to delete student" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
