// Node.js + Express Backend Reference
// Deploy this on Render or any Node.js hosting

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
app.get('/api/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    res.json({ status: 'OK', message: 'Database connected' });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: error.message });
  }
});

// Import routes
const authRoutes = require('./routes/auth');
const policyRoutes = require('./routes/policies');
const customerRoutes = require('./routes/customers');
const agentRoutes = require('./routes/agents');
const claimRoutes = require('./routes/claims');
const paymentRoutes = require('./routes/payments');
const supportRoutes = require('./routes/support');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/support', supportRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { pool };
