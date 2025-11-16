// Node.js + Express Backend
// Deploy this on Render or any Node.js hosting

import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// Test database connection
import db from './config/db.js';

app.get('/api/health', async (req, res) => {
  try {
    const connection = await db.getConnection();
    connection.release();
    res.json({ status: 'OK', message: 'Database connected' });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: error.message });
  }
});

// Import routes
import authRoutes from './routes/auth.js';
import policyRoutes from './routes/policies.js';
import customerRoutes from './routes/customers.js';
import agentRoutes from './routes/agents.js';
import claimRoutes from './routes/claims.js';
import paymentRoutes from './routes/payments.js';
import supportRoutes from './routes/support.js';

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
