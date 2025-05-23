import pool from '@/lib/db';

export default async function handler(req, res) {
  try {
    const { method } = req;

    switch (method) {
      case 'GET':
        // Get all school years
        const [years] = await pool.query('SELECT * FROM school_years ORDER BY start_year DESC');
        res.status(200).json(years);
        break;

      case 'POST':
        // Add new school year or update status
        const { action, id, startYear, endYear } = req.body;

        if (action === 'add') {
          // Validate year range
          if (endYear !== startYear + 1) {
            return res.status(400).json({ error: 'School year must span exactly 1 year' });
          }

          // First set all to inactive if adding new
          await pool.query('UPDATE school_years SET status = "Inactive"');

          // Add new school year
          const [result] = await pool.query(
            'INSERT INTO school_years (start_year, end_year, status) VALUES (?, ?, "Active")',
            [startYear, endYear]
          );
          res.status(201).json({ id: result.insertId });
        } 
        else if (action === 'activate') {
          // Activate specific year
          await pool.query('UPDATE school_years SET status = "Inactive"');
          await pool.query('UPDATE school_years SET status = "Active" WHERE id = ?', [id]);
          res.status(200).json({ message: 'School year activated' });
        } 
        else if (action === 'delete') {
          // Delete school year
          const [activeYear] = await pool.query('SELECT id FROM school_years WHERE status = "Active"');
          if (activeYear[0]?.id === id) {
            return res.status(400).json({ error: 'Cannot delete active school year' });
          }
          await pool.query('DELETE FROM school_years WHERE id = ?', [id]);
          res.status(200).json({ message: 'School year deleted' });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Database error occurred' });
  }
}