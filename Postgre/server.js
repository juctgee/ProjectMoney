const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// -------------------- PostgreSQL --------------------
const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '261146',
  database: process.env.DB_NAME || 'Money'
});

pool.connect()
  .then(() => {
    console.log('✅ Connected to PostgreSQL');
    seedData(); // เรียกฟังก์ชัน seed ข้อมูล
  })
  .catch(err => console.error('❌ DB connection error:', err));

// -------------------- Seed Data --------------------
async function seedData() {
  try {
    // สร้าง table ถ้าไม่มี
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE,
        email VARCHAR(100) UNIQUE,
        password VARCHAR(255)
      );
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        amount NUMERIC,
        description VARCHAR(255),
        date DATE
      );
      CREATE TABLE IF NOT EXISTS budget (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        amount NUMERIC,
        category VARCHAR(50)
      );
    `);

    // เช็คว่ามี user อยู่แล้วหรือยัง
    const { rows } = await pool.query('SELECT * FROM users WHERE username=$1', ['testuser']);
    if (rows.length === 0) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      const result = await pool.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id',
        ['testuser', 'test@example.com', hashedPassword]
      );
      const userId = result.rows[0].id;

      // เพิ่ม transactions ตัวอย่าง
      await pool.query(
        'INSERT INTO transactions (user_id, amount, description, date) VALUES ($1, $2, $3, $4), ($1, $5, $6, $7)',
        [userId, 1000, 'Salary', '2025-08-01', -200, 'Groceries', '2025-08-05']
      );

      // เพิ่ม budget ตัวอย่าง
      await pool.query(
        'INSERT INTO budget (user_id, amount, category) VALUES ($1, $2, $3), ($1, $4, $5)',
        [userId, 5000, 'Food', 3000, 'Transport']
      );

      console.log('✅ Seed data created');
    } else {
      console.log('ℹ️ Seed data already exists');
    }
  } catch (err) {
    console.error('❌ Error seeding data:', err);
  }
}

// -------------------- Basic Auth --------------------
async function authenticate(req, res) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic');
    return res.status(401).json({ error: 'Authorization required' });
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid password' });

    return user;
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
}

// -------------------- Routes --------------------

// Root
app.get('/', (req, res) => res.send('Server is running. Use /api/... endpoints'));

// Login
app.post('/api/users/login', async (req, res) => {
  const user = await authenticate(req, res);
  if (!user) return;
  res.status(200).json({ message: 'Login successful', userId: user.id });
});

// Home
app.get('/api/savings/home', async (req, res) => {
  const user = await authenticate(req, res);
  if (!user) return;

  try {
    const transactionsRes = await pool.query(
      'SELECT * FROM transactions WHERE user_id=$1 ORDER BY date DESC LIMIT 5',
      [user.id]
    );
    const budgetRes = await pool.query('SELECT * FROM budget WHERE user_id=$1', [user.id]);

    res.json({
      isNewUser: transactionsRes.rows.length === 0 && budgetRes.rows.length === 0,
      recentTransactions: transactionsRes.rows,
      budget: budgetRes.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// -------------------- Start Server --------------------
app.listen(8082, () => console.log('Server running on port 8082'));
