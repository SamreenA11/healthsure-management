const express = require('express');
const router = express.Router();
const { pool } = require('../server');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Get all payments (admin only)
router.get('/', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const [payments] = await pool.execute(
      `SELECT pay.*, c.name as customer_name, p.name as policy_name
       FROM payments pay
       JOIN purchased_policies pp ON pay.purchased_policy_id = pp.purchased_policy_id
       JOIN customers c ON pp.customer_id = c.customer_id
       JOIN policies p ON pp.policy_id = p.policy_id
       ORDER BY pay.payment_date DESC`
    );
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get payments by customer ID
router.get('/customer/:customerId', authMiddleware, async (req, res) => {
  try {
    const { customerId } = req.params;
    const [payments] = await pool.execute(
      `SELECT pay.*, p.name as policy_name, pp.purchased_policy_id
       FROM payments pay
       JOIN purchased_policies pp ON pay.purchased_policy_id = pp.purchased_policy_id
       JOIN policies p ON pp.policy_id = p.policy_id
       WHERE pp.customer_id = ?
       ORDER BY pay.payment_date DESC`,
      [customerId]
    );
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get payments by purchased policy ID
router.get('/policy/:purchasedPolicyId', authMiddleware, async (req, res) => {
  try {
    const { purchasedPolicyId } = req.params;
    const [payments] = await pool.execute(
      'SELECT * FROM payments WHERE purchased_policy_id = ? ORDER BY payment_date DESC',
      [purchasedPolicyId]
    );
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get payment by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const [payments] = await pool.execute(
      `SELECT pay.*, c.name as customer_name, p.name as policy_name
       FROM payments pay
       JOIN purchased_policies pp ON pay.purchased_policy_id = pp.purchased_policy_id
       JOIN customers c ON pp.customer_id = c.customer_id
       JOIN policies p ON pp.policy_id = p.policy_id
       WHERE pay.payment_id = ?`,
      [id]
    );
    
    if (payments.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    res.json(payments[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Record a new payment
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { 
      purchased_policy_id, 
      amount, 
      payment_method, 
      transaction_id 
    } = req.body;
    
    const [result] = await pool.execute(
      `INSERT INTO payments 
       (purchased_policy_id, amount, payment_method, transaction_id, status) 
       VALUES (?, ?, ?, ?, 'completed')`,
      [purchased_policy_id, amount, payment_method, transaction_id]
    );
    
    res.status(201).json({ 
      message: 'Payment recorded successfully',
      paymentId: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update payment status
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await pool.execute(
      'UPDATE payments SET status = ? WHERE payment_id = ?',
      [status, id]
    );
    
    res.json({ message: 'Payment status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get payment statistics (admin only)
router.get('/stats/summary', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const [stats] = await pool.execute(
      `SELECT 
        COUNT(*) as total_payments,
        SUM(amount) as total_amount,
        AVG(amount) as average_amount,
        SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as completed_amount,
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as pending_amount
       FROM payments
       WHERE payment_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)`
    );
    res.json(stats[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
