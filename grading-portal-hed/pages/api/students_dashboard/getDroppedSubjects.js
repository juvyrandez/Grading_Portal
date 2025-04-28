// API: /api/students_dashboard/getDroppedSubjects
import pool from '@/lib/db';

export default async function handler(req, res) {
  const { studentId } = req.query;

  try {
    const [results] = await pool.query(`
      SELECT s.subject_id, s.subject_code, s.subject_name, s.units, drs.dropped_at
      FROM dropped_regular_subjects drs
      JOIN subjects s ON drs.subject_id = s.subject_id
      WHERE drs.student_id = ?
      ORDER BY drs.dropped_at DESC
    `, [studentId]);

    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching dropped subjects:', error);
    res.status(500).json({ message: 'Error fetching dropped subjects' });
  }
}