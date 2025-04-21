import pool from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { id } = req.query;

    try {
      // Delete student's grades first
      await pool.query("DELETE FROM student_grades WHERE student_id = ?", [id]);

      // Now delete the student from users
      await pool.query("DELETE FROM users WHERE id = ?", [id]);

      return res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
      console.error("Error deleting student:", error);
      return res.status(500).json({ message: "Failed to delete student" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
