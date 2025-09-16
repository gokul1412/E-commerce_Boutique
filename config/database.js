const mysql = require('mysql2/promise');
require('dotenv').config();

let pool = null;

async function getPool() {
  if (pool) return pool;
  
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  
  try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL successfully');
    connection.release();
    return pool;
  } catch (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    throw err;
  }
}

// Initialize the pool
getPool().catch(err => {
  console.error('Failed to initialize database pool', err);
  process.exit(1);
});

module.exports = {
  execute: async (query, params = []) => {
    const pool = await getPool();
    return pool.execute(query, params);
  },
  query: async (query, params = []) => {
    const pool = await getPool();
    return pool.query(query, params);
  },
  getConnection: async () => {
    const pool = await getPool();
    return pool.getConnection();
  }
};