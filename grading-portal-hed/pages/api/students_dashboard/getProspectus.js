import pool from '@/lib/db';

export default async function handler(req, res) {
  const { studentId } = req.query;

  try {
    // Get student info
    const [studentInfo] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [studentId]
    );

    if (studentInfo.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const { course } = studentInfo[0];

    // Get all years and semesters with subjects
    const prospectusData = [];
    
    // Loop through all 4 years
    for (let year = 1; year <= 4; year++) {
      const [semesters] = await pool.query(
        `SELECT DISTINCT semester FROM subjects 
         WHERE department = ? AND year_level = ?
         ORDER BY 
           CASE semester 
             WHEN '1st Semester' THEN 1 
             WHEN '2nd Semester' THEN 2 
             WHEN 'Summer' THEN 3 
           END`,
        [course, year]
      );

      // Get subjects for each semester in this year
      for (const sem of semesters) {
        const [subjects] = await pool.query(
          `SELECT s.subject_code, s.subject_name, s.units,
                  sg.midterm, sg.final, sg.general, sg.remarks
           FROM subjects s
           LEFT JOIN student_grades sg 
             ON s.subject_id = sg.subject_id AND sg.student_id = ?
           WHERE s.department = ? 
             AND s.year_level = ? 
             AND s.semester = ?
           ORDER BY s.subject_code`,
          [studentId, course, year, sem.semester]
        );

        prospectusData.push({
          semester: `Year ${year} - ${sem.semester}`,
          subjects
        });
      }
    }

    res.status(200).json(prospectusData);
  } catch (error) {
    console.error('Error fetching prospectus:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}