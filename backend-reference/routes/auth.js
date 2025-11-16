import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, name, phone, gender, address } = req.body;
    
    // Hash password
    const password_hash = await bcrypt.hash(password, 10);
    
    // Insert user
    const [userResult] = await db.execute(
      'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
      [email, password_hash, role]
    );
    
    const userId = userResult.insertId;
    
    // Insert role-specific data
    if (role === 'agent') {
      await db.execute(
        'INSERT INTO agents (user_id, name, phone, branch) VALUES (?, ?, ?, ?)',
        [userId, name, phone, 'Main']
      );
    } else if (role === 'customer') {
      await db.execute(
        'INSERT INTO customers (user_id, name, gender, phone, address, date_of_birth) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, name, gender, phone, address, new Date()]
      );
    }
    
    res.status(201).json({ message: 'User registered successfully', userId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const [users] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = users[0];
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: user.user_id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
