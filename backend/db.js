const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'library_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database');
    connection.release();
    
    // Create books table if it doesn't exist
    await createBooksTable();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('💡 Make sure:');
    console.log('   1. XAMPP MySQL is running');
    console.log('   2. Database "library_db" exists in phpMyAdmin');
    console.log('   3. MySQL credentials in .env are correct');
  }
};

// Create books table
const createBooksTable = async () => {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS books (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      author VARCHAR(100) NOT NULL,
      genre VARCHAR(50),
      year INT,
      isbn VARCHAR(17),
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  try {
    await pool.execute(createTableSQL);
    console.log('✅ Books table ready');
  } catch (error) {
    console.error('❌ Error creating books table:', error.message);
  }
};

// Initialize database
testConnection();

module.exports = pool;