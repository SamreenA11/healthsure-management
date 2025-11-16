import express from 'express';
import db from '../config/db.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all support tickets (admin/agent)
router.get('/', authMiddleware, roleMiddleware(['admin', 'agent']), async (req, res) => {
  try {
    const [tickets] = await db.execute(
      `SELECT st.*, c.name as customer_name, u.email as customer_email
       FROM support_tickets st
       JOIN customers c ON st.customer_id = c.customer_id
       JOIN users u ON c.user_id = u.user_id
       ORDER BY st.created_at DESC`
    );
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get tickets by customer ID
router.get('/customer/:customerId', authMiddleware, async (req, res) => {
  try {
    const { customerId } = req.params;
    const [tickets] = await db.execute(
      'SELECT * FROM support_tickets WHERE customer_id = ? ORDER BY created_at DESC',
      [customerId]
    );
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get ticket by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const [tickets] = await db.execute(
      `SELECT st.*, c.name as customer_name, u.email as customer_email
       FROM support_tickets st
       JOIN customers c ON st.customer_id = c.customer_id
       JOIN users u ON c.user_id = u.user_id
       WHERE st.ticket_id = ?`,
      [id]
    );
    
    if (tickets.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    res.json(tickets[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new support ticket
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { customer_id, subject, description, priority } = req.body;
    
    const [result] = await db.execute(
      `INSERT INTO support_tickets 
       (customer_id, subject, description, priority, status) 
       VALUES (?, ?, ?, ?, 'open')`,
      [customer_id, subject, description, priority || 'medium']
    );
    
    res.status(201).json({ 
      message: 'Support ticket created successfully',
      ticketId: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update ticket status
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolution } = req.body;
    
    const updates = ['status = ?'];
    const values = [status];
    
    if (resolution) {
      updates.push('resolution = ?');
      values.push(resolution);
    }
    
    if (status === 'closed') {
      updates.push('resolved_at = CURRENT_TIMESTAMP');
    }
    
    values.push(id);
    
    await db.execute(
      `UPDATE support_tickets SET ${updates.join(', ')} WHERE ticket_id = ?`,
      values
    );
    
    res.json({ message: 'Ticket updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Assign ticket to agent (admin only)
router.put('/:id/assign', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { agent_id } = req.body;
    
    await db.execute(
      'UPDATE support_tickets SET assigned_to = ? WHERE ticket_id = ?',
      [agent_id, id]
    );
    
    res.json({ message: 'Ticket assigned successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update ticket priority (admin/agent)
router.put('/:id/priority', authMiddleware, roleMiddleware(['admin', 'agent']), async (req, res) => {
  try {
    const { id } = req.params;
    const { priority } = req.body;
    
    await db.execute(
      'UPDATE support_tickets SET priority = ? WHERE ticket_id = ?',
      [priority, id]
    );
    
    res.json({ message: 'Priority updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
