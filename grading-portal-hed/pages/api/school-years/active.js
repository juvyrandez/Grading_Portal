import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const [activeYear] = await pool.query(
      'SELECT * FROM school_years WHERE status = "Active" LIMIT 1'
    );
    
    if (activeYear.length === 0) {
      return res.status(200).json(null);
    }
    
    res.status(200).json(activeYear[0]);
  } catch (error) {
    console.error('Error fetching active school year:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}