import express from 'express';
import db from '../config/db.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all policies
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM policies WHERE status = "active" ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get policy by ID with details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [policies] = await db.execute(
      'SELECT * FROM policies WHERE policy_id = ?',
      [id]
    );
    
    if (policies.length === 0) {
      return res.status(404).json({ error: 'Policy not found' });
    }
    
    const policy = policies[0];
    
    // Get type-specific details
    if (policy.type === 'health') {
      const [healthDetails] = await db.execute(
        'SELECT * FROM health_policies WHERE policy_id = ?',
        [id]
      );
      policy.details = healthDetails[0] || null;
    } else if (policy.type === 'life') {
      const [lifeDetails] = await db.execute(
        'SELECT * FROM life_policies WHERE policy_id = ?',
        [id]
      );
      policy.details = lifeDetails[0] || null;
    } else if (policy.type === 'family') {
      const [familyDetails] = await db.execute(
        'SELECT * FROM family_policies WHERE policy_id = ?',
        [id]
      );
      policy.details = familyDetails[0] || null;
    }
    
    res.json(policy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get customer's purchased policies
router.get('/customer/:customerId', authMiddleware, async (req, res) => {
  try {
    const { customerId } = req.params;
    const [purchasedPolicies] = await db.execute(
      `SELECT pp.*, p.name, p.type, p.coverage_amount, p.duration_years
       FROM purchased_policies pp
       JOIN policies p ON pp.policy_id = p.policy_id
       WHERE pp.customer_id = ?
       ORDER BY pp.start_date DESC`,
      [customerId]
    );
    res.json(purchasedPolicies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Purchase a policy
router.post('/purchase', authMiddleware, async (req, res) => {
  try {
    const { customer_id, policy_id, start_date, premium_amount } = req.body;
    
    const [result] = await db.execute(
      `INSERT INTO purchased_policies 
       (customer_id, policy_id, start_date, premium_amount, status) 
       VALUES (?, ?, ?, ?, 'active')`,
      [customer_id, policy_id, start_date, premium_amount]
    );
    
    res.status(201).json({ 
      message: 'Policy purchased successfully',
      purchasedPolicyId: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new policy (admin only)
router.post('/', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { name, type, description, base_premium, coverage_amount, duration_years } = req.body;
    
    const [result] = await db.execute(
      `INSERT INTO policies 
       (name, type, description, base_premium, coverage_amount, duration_years) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, type, description, base_premium, coverage_amount, duration_years]
    );
    
    res.status(201).json({ 
      message: 'Policy created successfully',
      policyId: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update policy (admin only)
router.put('/:id', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, base_premium, coverage_amount, status } = req.body;
    
    await db.execute(
      `UPDATE policies 
       SET name = ?, description = ?, base_premium = ?, coverage_amount = ?, status = ?
       WHERE policy_id = ?`,
      [name, description, base_premium, coverage_amount, status, id]
    );
    
    res.json({ message: 'Policy updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
