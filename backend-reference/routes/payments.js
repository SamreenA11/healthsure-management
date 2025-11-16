import express from 'express';
import db from '../config/db.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Input validation helper
const validateId = (id) => {
  const numId = parseInt(id, 10);
  if (isNaN(numId) || numId < 1) {
    throw new Error('Invalid ID format');
  }
  return numId;
};

const validateAmount = (amount) => {
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount < 0) {
    throw new Error('Invalid amount');
  }
  return numAmount;
};

// Get all payments (admin only)
router.get('/', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const query = `SELECT pay.*, c.name as customer_name, p.name as policy_name
                   FROM payments pay
                   JOIN purchased_policies pp ON pay.purchased_policy_id = pp.purchased_policy_id
                   JOIN customers c ON pp.customer_id = c.customer_id
                   JOIN policies p ON pp.policy_id = p.policy_id
                   ORDER BY pay.payment_date DESC`;
    const [payments] = await db.execute(query);
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// Get payments by customer ID
router.get('/customer/:customerId', authMiddleware, async (req, res) => {
  try {
    const customerId = validateId(req.params.customerId);
    const query = `SELECT pay.*, p.name as policy_name, pp.purchased_policy_id
                   FROM payments pay
                   JOIN purchased_policies pp ON pay.purchased_policy_id = pp.purchased_policy_id
                   JOIN policies p ON pp.policy_id = p.policy_id
                   WHERE pp.customer_id = ?
                   ORDER BY pay.payment_date DESC`;
    const [payments] = await db.execute(query, [customerId]);
    res.json(payments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get payments by purchased policy ID
router.get('/policy/:purchasedPolicyId', authMiddleware, async (req, res) => {
  try {
    const policyId = validateId(req.params.purchasedPolicyId);
    const query = 'SELECT * FROM payments WHERE purchased_policy_id = ? ORDER BY payment_date DESC';
    const [payments] = await db.execute(query, [policyId]);
    res.json(payments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get payment by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const paymentId = validateId(req.params.id);
    const query = `SELECT pay.*, c.name as customer_name, p.name as policy_name
                   FROM payments pay
                   JOIN purchased_policies pp ON pay.purchased_policy_id = pp.purchased_policy_id
                   JOIN customers c ON pp.customer_id = c.customer_id
                   JOIN policies p ON pp.policy_id = p.policy_id
                   WHERE pay.payment_id = ?`;
    const [payments] = await db.execute(query, [paymentId]);
    
    if (payments.length === 0) {
      return res.status(404).json({ error: 'Payment record not found' });
    }
    
    res.json(payments[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create new payment record
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { purchased_policy_id, amount, payment_method, transaction_id } = req.body;
    
    // Validate inputs
    if (!purchased_policy_id || !amount || !payment_method) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const validatedPolicyId = validateId(purchased_policy_id);
    const validatedAmount = validateAmount(amount);
    
    if (payment_method.length > 50) {
      return res.status(400).json({ error: 'Payment method too long' });
    }
    
    const query = `INSERT INTO payments 
                   (purchased_policy_id, amount, payment_method, transaction_id, status) 
                   VALUES (?, ?, ?, ?, 'completed')`;
    const [result] = await db.execute(query, [
      validatedPolicyId, 
      validatedAmount, 
      payment_method, 
      transaction_id || null
    ]);
    
    res.status(201).json({ 
      message: 'Payment recorded successfully',
      paymentId: result.insertId 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update payment status
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const paymentId = validateId(req.params.id);
    const { status } = req.body;
    
    const validStatuses = ['pending', 'completed', 'failed', 'refunded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    
    const query = 'UPDATE payments SET status = ? WHERE payment_id = ?';
    await db.execute(query, [status, paymentId]);
    
    res.json({ message: 'Payment status updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get payment statistics (admin only)
router.get('/stats/summary', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const query = `SELECT 
                    COUNT(*) as total_payments,
                    SUM(amount) as total_amount,
                    AVG(amount) as average_amount,
                    SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as completed_amount,
                    SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as pending_amount
                   FROM payments
                   WHERE payment_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)`;
    const [stats] = await db.execute(query);
    res.json(stats[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;
