const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// เชื่อมต่อ MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'moneyy',
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// API สมัครสมาชิก
app.post('/api/users/signup', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // ตรวจสอบว่ามีอีเมลที่ซ้ำในฐานข้อมูลหรือไม่
  const checkEmailSql = 'SELECT * FROM users WHERE email = ?';
  db.query(checkEmailSql, [email], (err, results) => {
    if (err) {
      console.error('Error checking email:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length > 0) {
      return res.status(400).json({ error: 'Email is already in use' });
    }

    // แฮชรหัสผ่าน
    const hashedPassword = bcrypt.hashSync(password, 10);
    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(sql, [username, email, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    });
  });
});

// API สำหรับการเข้าสู่ระบบ
app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // ตรวจสอบรหัสผ่านที่แฮชแล้ว
    bcrypt.compare(password, results[0].password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).json({ error: 'Error comparing passwords' });
      }
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid password' });
      }

      // หากรหัสผ่านตรง จะส่งข้อมูลของผู้ใช้กลับไป
      res.status(200).json({ message: 'Login successful', userId: results[0].id });
    });
  });
});

// API สำหรับหน้าแรก / Home
app.get('/api/savings/home', (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  // ดึงข้อมูลธุรกรรมล่าสุด
  const transactionsSql = 'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC LIMIT 5';
  db.query(transactionsSql, [userId], (err, transactions) => {
    if (err) {
      console.error('Error fetching transactions:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    // ดึงข้อมูลงบประมาณ
    const budgetSql = 'SELECT * FROM budget WHERE user_id = ?';
    db.query(budgetSql, [userId], (err, budget) => {
      if (err) {
        console.error('Error fetching budget:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      // เช็คว่าผู้ใช้เป็นสมาชิกใหม่หรือเก่า
      const isNewUser = transactions.length === 0 && budget.length === 0;

      const homeData = {
        isNewUser, 
        recentTransactions: transactions,
        budget: budget,
      };

      res.status(200).json(homeData);
    });
  });
});

// API สำหรับการจัดการ Transactions
app.post('/api/transactions', (req, res) => {
  const { userId, amount, description, date } = req.body;

  if (!userId || !amount || !description || !date) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sql = 'INSERT INTO transactions (user_id, amount, description, date) VALUES (?, ?, ?, ?)';
  db.query(sql, [userId, amount, description, date], (err, result) => {
    if (err) {
      console.error('Error inserting transaction:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'Transaction added successfully', transactionId: result.insertId });
  });
});

// API สำหรับการจัดการ Budget
app.post('/api/budget', (req, res) => {
  const { userId, amount, category } = req.body;

  if (!userId || !amount || !category) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sql = 'INSERT INTO budget (user_id, amount, category) VALUES (?, ?, ?)';
  db.query(sql, [userId, amount, category], (err, result) => {
    if (err) {
      console.error('Error inserting budget:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'Budget added successfully', budgetId: result.insertId });
  });
});

// API สำหรับการจัดการ Profile
app.get('/api/users/profile/:userId', (req, res) => {
  const { userId } = req.params;

  const sql = 'SELECT username, email FROM users WHERE id = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching profile:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(results[0]);
  });
});

// API อัปเดตข้อมูลผู้ใช้
app.put('/api/users/update', (req, res) => {
  const { userId, username, email, password } = req.body;

  if (!userId || !username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // แฮชรหัสผ่านใหม่
  const hashedPassword = bcrypt.hashSync(password, 10);
  const sql = 'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?';
  db.query(sql, [username, email, hashedPassword, userId], (err, result) => {
    if (err) {
      console.error('Error updating user:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User information updated successfully' });
  });
});

// Start Server
app.listen(8082, () => {
  console.log('Server is running on port 8082');
});
