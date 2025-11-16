const express = require('express');
const router = express.Router();
const { pool } = require('../server');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Get all claims (admin/agent)
router.get('/', authMiddleware, roleMiddleware(['admin', 'agent']), async (req, res) => {
  try {
    const [claims] = await pool.execute(
      `SELECT cl.*, c.name as customer_name, p.name as policy_name, pp.purchased_policy_id
       FROM claims cl
       JOIN purchased_policies pp ON cl.purchased_policy_id = pp.purchased_policy_id
       JOIN customers c ON pp.customer_id = c.customer_id
       JOIN policies p ON pp.policy_id = p.policy_id
       ORDER BY cl.claim_date DESC`
    );
    res.json(claims);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get claims by customer ID
router.get('/customer/:customerId', authMiddleware, async (req, res) => {
  try {
    const { customerId } = req.params;
    const [claims] = await pool.execute(
      `SELECT cl.*, p.name as policy_name, pp.purchased_policy_id
       FROM claims cl
       JOIN purchased_policies pp ON cl.purchased_policy_id = pp.purchased_policy_id
       JOIN policies p ON pp.policy_id = p.policy_id
       WHERE pp.customer_id = ?
       ORDER BY cl.claim_date DESC`,
      [customerId]
    );
    res.json(claims);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get claim by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const [claims] = await pool.execute(
      `SELECT cl.*, c.name as customer_name, c.customer_id, p.name as policy_name
       FROM claims cl
       JOIN purchased_policies pp ON cl.purchased_policy_id = pp.purchased_policy_id
       JOIN customers c ON pp.customer_id = c.customer_id
       JOIN policies p ON pp.policy_id = p.policy_id
       WHERE cl.claim_id = ?`,
      [id]
    );
    
    if (claims.length === 0) {
      return res.status(404).json({ error: 'Claim not found' });
    }
    
    res.json(claims[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit a new claim
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { purchased_policy_id, claim_amount, incident_date, description, hospital_name } = req.body;
    
    const [result] = await pool.execute(
      `INSERT INTO claims 
       (purchased_policy_id, claim_amount, incident_date, description, hospital_name, status) 
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [purchased_policy_id, claim_amount, incident_date, description, hospital_name]
    );
    
    res.status(201).json({ 
      message: 'Claim submitted successfully',
      claimId: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update claim status (admin/agent only)
router.put('/:id/status', authMiddleware, roleMiddleware(['admin', 'agent']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, settlement_amount, remarks } = req.body;
    
    const updates = [];
    const values = [];
    
    if (status) {
      updates.push('status = ?');
      values.push(status);
    }
    if (settlement_amount !== undefined) {
      updates.push('settlement_amount = ?');
      values.push(settlement_amount);
    }
    if (remarks) {
      updates.push('remarks = ?');
      values.push(remarks);
    }
    
    if (status === 'approved') {
      updates.push('settlement_date = CURRENT_TIMESTAMP');
    }
    
    values.push(id);
    
    await pool.execute(
      `UPDATE claims SET ${updates.join(', ')} WHERE claim_id = ?`,
      values
    );
    
    res.json({ message: 'Claim updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
