import pool from "@/lib/db";

export default async function handler(req, res) {
  const { studentId, department } = req.query;

  try {
    if (req.method === 'GET') {
      // Base query for available subjects
      let availableSubjectsQuery = `
        SELECT s.* FROM subjects s
        WHERE s.subject_id NOT IN (
          SELECT subject_id FROM student_grades 
          WHERE student_id = ? AND is_irregular = TRUE
        )
      `;
      
      const queryParams = [studentId];
      
      // Add department filter if provided
      if (department) {
        availableSubjectsQuery += ' AND s.department = ?';
        queryParams.push(department);
      }
      
      // Get available subjects
      const [subjects] = await pool.query(availableSubjectsQuery, queryParams);

      // Get currently assigned irregular subjects
      const [assignedSubjects] = await pool.query(`
        SELECT s.*, iss.semester 
        FROM subjects s
        JOIN irregular_student_subjects iss ON s.subject_id = iss.subject_id
        WHERE iss.student_id = ?
      `, [studentId]);

      res.status(200).json({ 
        availableSubjects: subjects, 
        assignedSubjects 
      });
    }
    else if (req.method === 'POST') {
      // Assign new irregular subject
      const { student_id, subject_id, semester } = req.body;
      
      await pool.query(`
        INSERT INTO irregular_student_subjects 
        (student_id, subject_id, semester) 
        VALUES (?, ?, ?)
      `, [student_id, subject_id, semester]);

      res.status(201).json({ message: 'Subject assigned successfully' });
    }
    else if (req.method === 'DELETE') {
      // Remove irregular subject assignment
      const { student_id, subject_id } = req.query;
      
      await pool.query(`
        DELETE FROM irregular_student_subjects 
        WHERE student_id = ? AND subject_id = ?
      `, [student_id, subject_id]);

      res.status(200).json({ message: 'Subject removed successfully' });
    }
    else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in irregular subjects:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}