const express = require('express');
const router = express.Router();
const Agent = require('../models/Agent');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/authMiddleware');

// POST /api/agents 
router.post('/', auth, async (req, res) => {
  const { name, email, mobile, password } = req.body;
  if (!name || !email || !mobile || !password) return res.status(400).json({ message: 'All fields required.' });

  try {
    const exists = await Agent.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Agent with this email already exists.' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const agent = new Agent({ name, email, mobile, passwordHash });
    await agent.save();
    res.json({ message: 'Agent created', agent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/agents - list agents
router.get('/', auth, async (req, res) => {
  try {
    const agents = await Agent.find().select('-passwordHash').sort({ createdAt: 1 });
    res.json(agents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
