import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', 
  password: '', 
  database: 'grading_portal',
});

export default pool;
