const express = require('express');
const router = express.Router();
const { pool } = require('../server');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Get all customers (admin/agent only)
router.get('/', authMiddleware, roleMiddleware(['admin', 'agent']), async (req, res) => {
  try {
    const [customers] = await pool.execute(
      `SELECT c.*, u.email, u.status, a.name as agent_name
       FROM customers c
       JOIN users u ON c.user_id = u.user_id
       LEFT JOIN agents a ON c.agent_id = a.agent_id
       ORDER BY c.created_at DESC`
    );
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get customer by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const [customers] = await pool.execute(
      `SELECT c.*, u.email, u.status
       FROM customers c
       JOIN users u ON c.user_id = u.user_id
       WHERE c.customer_id = ?`,
      [id]
    );
    
    if (customers.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.json(customers[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get customer by user ID
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const [customers] = await pool.execute(
      `SELECT c.*, u.email, u.status
       FROM customers c
       JOIN users u ON c.user_id = u.user_id
       WHERE c.user_id = ?`,
      [userId]
    );
    
    if (customers.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.json(customers[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update customer profile
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, address, city, state, pincode } = req.body;
    
    await pool.execute(
      `UPDATE customers 
       SET name = ?, phone = ?, address = ?, city = ?, state = ?, pincode = ?
       WHERE customer_id = ?`,
      [name, phone, address, city, state, pincode, id]
    );
    
    res.json({ message: 'Customer profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Assign agent to customer (admin only)
router.put('/:id/assign-agent', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { agent_id } = req.body;
    
    await pool.execute(
      'UPDATE customers SET agent_id = ? WHERE customer_id = ?',
      [agent_id, id]
    );
    
    res.json({ message: 'Agent assigned successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
