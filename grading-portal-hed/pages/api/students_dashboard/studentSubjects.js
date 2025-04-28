import pool from '@/lib/db';

export default async function handler(req, res) {
  const { studentId } = req.query;

  if (!studentId) {
    return res.status(400).json({ message: 'Student ID is required' });
  }

  try {
    // First get student info to know their course and year
    const [studentRows] = await pool.query('SELECT course, year_level FROM users WHERE id = ?', [studentId]);
    if (studentRows.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    const student = studentRows[0];

    // Get regular subjects based on student's course and year
    const [regularSubjects] = await pool.query(
      `SELECT s.subject_id, s.subject_code, s.subject_name, s.units, s.semester 
       FROM subjects s 
       WHERE s.department = ? AND s.year_level = ? 
       ORDER BY s.semester, s.subject_code`,
      [student.course, student.year_level]
    );

    // Get irregular subjects
    const [irregularSubjects] = await pool.query(
      `SELECT s.subject_id, s.subject_code, s.subject_name, s.units, iss.semester 
       FROM irregular_student_subjects iss
       JOIN subjects s ON iss.subject_id = s.subject_id
       WHERE iss.student_id = ?
       ORDER BY iss.semester, s.subject_code`,
      [studentId]
    );

    // Get dropped regular subjects
    const [droppedRegularSubjects] = await pool.query(
      `SELECT s.subject_id, s.subject_code, s.subject_name, s.units, s.semester, drs.dropped_at
       FROM dropped_regular_subjects drs
       JOIN subjects s ON drs.subject_id = s.subject_id
       WHERE drs.student_id = ?
       ORDER BY s.semester, s.subject_code`,
      [studentId]
    );

    res.status(200).json({
      regularSubjects,
      irregularSubjects,
      droppedRegularSubjects
    });
  } catch (error) {
    console.error('Error fetching student subjects:', error);
    res.status(500).json({ message: 'Server error fetching subjects' });
  }
}