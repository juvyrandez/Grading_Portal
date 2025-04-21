import pool from "@/lib/db";

export default async function handler(req, res) {
  try {
    const [departments] = await pool.query(`
      SELECT course, COUNT(*) AS count 
      FROM users 
      WHERE user_type = 'user' AND status = 'Active' 
      GROUP BY course
    `);

    const departmentData = {
      BSIT: 0,
      CJEP: 0,
      BSBA: 0,
      TEP: 0,
      HM: 0,
    };

    departments.forEach((dept) => {
      if (departmentData.hasOwnProperty(dept.course)) {
        departmentData[dept.course] = dept.count;
      }
    });

    res.status(200).json(departmentData);
  } catch (error) {
    console.error("Failed to fetch department counts:", error);
    res.status(500).json({ error: "Failed to load department counts" });
  }
}
