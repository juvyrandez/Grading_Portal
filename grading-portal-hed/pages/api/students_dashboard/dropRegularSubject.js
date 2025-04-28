import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { student_id, subject_id } = req.body;

    if (!student_id || !subject_id) {
      return res.status(400).json({ message: 'Student ID and Subject ID are required' });
    }

    // Get student info
    const [studentRows] = await pool.query('SELECT course, year_level FROM users WHERE id = ?', [student_id]);
    if (studentRows.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    const student = studentRows[0];

    // Verify this is a regular subject for the student
    const [subjectRows] = await pool.query(
      'SELECT * FROM subjects WHERE subject_id = ? AND department = ? AND year_level = ?',
      [subject_id, student.course, student.year_level]
    );

    if (subjectRows.length === 0) {
      return res.status(400).json({ message: 'Subject is not a regular subject for this student' });
    }

    // Check if already dropped
    const [alreadyDropped] = await pool.query(
      'SELECT * FROM dropped_regular_subjects WHERE student_id = ? AND subject_id = ?',
      [student_id, subject_id]
    );

    if (alreadyDropped.length > 0) {
      return res.status(400).json({ message: 'Subject already dropped' });
    }

    // Add to dropped regular subjects table
    await pool.query(
      'INSERT INTO dropped_regular_subjects (student_id, subject_id) VALUES (?, ?)',
      [student_id, subject_id]
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error dropping regular subject:', error);
    return res.status(500).json({ message: 'Error dropping regular subject' });
  }
}