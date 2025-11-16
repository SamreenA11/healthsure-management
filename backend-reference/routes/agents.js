const express = require('express');
const router = express.Router();
const { pool } = require('../server');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Get all agents (admin only)
router.get('/', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const [agents] = await pool.execute(
      `SELECT a.*, u.email, u.status,
       COUNT(DISTINCT c.customer_id) as customer_count
       FROM agents a
       JOIN users u ON a.user_id = u.user_id
       LEFT JOIN customers c ON a.agent_id = c.agent_id
       GROUP BY a.agent_id
       ORDER BY a.created_at DESC`
    );
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get agent by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const [agents] = await pool.execute(
      `SELECT a.*, u.email, u.status
       FROM agents a
       JOIN users u ON a.user_id = u.user_id
       WHERE a.agent_id = ?`,
      [id]
    );
    
    if (agents.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    res.json(agents[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get agent by user ID
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const [agents] = await pool.execute(
      `SELECT a.*, u.email, u.status
       FROM agents a
       JOIN users u ON a.user_id = u.user_id
       WHERE a.user_id = ?`,
      [userId]
    );
    
    if (agents.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    res.json(agents[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get agent's customers
router.get('/:id/customers', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const [customers] = await pool.execute(
      `SELECT c.*, u.email
       FROM customers c
       JOIN users u ON c.user_id = u.user_id
       WHERE c.agent_id = ?
       ORDER BY c.created_at DESC`,
      [id]
    );
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update agent profile
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, branch } = req.body;
    
    await pool.execute(
      'UPDATE agents SET name = ?, phone = ?, branch = ? WHERE agent_id = ?',
      [name, phone, branch, id]
    );
    
    res.json({ message: 'Agent profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update commission rate (admin only)
router.put('/:id/commission', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { commission_rate } = req.body;
    
    await pool.execute(
      'UPDATE agents SET commission_rate = ? WHERE agent_id = ?',
      [commission_rate, id]
    );
    
    res.json({ message: 'Commission rate updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
