const express = require('express');
const router = express.Router();
const multer = require('multer');
const csvParse = require('csv-parse/lib/sync');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/authMiddleware');
const Agent = require('../models/Agent');
const AssignedList = require('../models/AssignedList');

// storage to memory
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Only csv, xls, xlsx are allowed'));
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

// POST /api/upload - upload file and distribute
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const buffer = req.file.buffer;
    let rows = [];

    // detect mimetype to parse accordingly
    if (req.file.mimetype === 'text/csv' || req.file.originalname.endsWith('.csv')) {
      // parse CSV
      const text = buffer.toString('utf8');
      const records = csvParse(text, { columns: true, skip_empty_lines: true, trim: true });
      rows = records;
    } else {
      // parse xlsx/xls
      const workbook = xlsx.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const json = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });
      rows = json;
    }

    // Validate required columns: FirstName, Phone, Notes (case-insensitive)
    const normalized = rows.map(r => {
      // support common headers variants
      const keys = Object.keys(r);
      const map = {};
      keys.forEach(k => map[k.toLowerCase().trim()] = r[k]);
      return {
        firstName: map['firstname'] ?? map['first name'] ?? map['first_name'] ?? '',
        phone: String(map['phone'] ?? map['mobile'] ?? map['number'] ?? ''),
        notes: map['notes'] ?? map['note'] ?? ''
      };
    });

    // remove empty rows
    const filtered = normalized.filter(it => it.firstName || it.phone);

    if (filtered.length === 0) return res.status(400).json({ message: 'No valid rows found in file' });

    // Get 5 agents
    const agents = await Agent.find().sort({ createdAt: 1 }).limit(5);
    if (agents.length < 5) return res.status(400).json({ message: 'At least 5 agents required to distribute lists.' });

    // Distribution algorithm: distribute equally, then remainder sequentially
    const n = filtered.length;
    const base = Math.floor(n / 5);
    let remainder = n % 5;

    const assignments = []; // array of arrays
    let index = 0;
    for (let i = 0; i < 5; i++) {
      let cnt = base + (remainder > 0 ? 1 : 0);
      if (remainder > 0) remainder--;
      const chunk = filtered.slice(index, index + cnt);
      assignments.push(chunk);
      index += cnt;
    }

    // Save assigned lists to DB 
    const saved = [];
    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];
      const items = assignments[i].map(it => ({
        firstName: it.firstName,
        phone: it.phone,
        notes: it.notes
      }));
      const assigned = new AssignedList({
        agent: agent._id,
        items,
        uploadedBy: req.user._id
      });
      await assigned.save();
      saved.push({ agent: { id: agent._id, name: agent.name, email: agent.email, mobile: agent.mobile }, count: items.length, assignedId: assigned._id });
    }

    res.json({ message: 'Distributed and saved', distributed: saved });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// GET /api/upload/assigned - view assigned lists (per agent)
router.get('/assigned', auth, async (req, res) => {
  try {
    const lists = await AssignedList.find().populate('agent', 'name email mobile').sort({ uploadedAt: -1 });
    res.json(lists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
