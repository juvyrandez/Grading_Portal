import pool from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method Not Allowed" });

  try {
    const [students] = await pool.query("SELECT * FROM users WHERE user_type = 'user'");
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
