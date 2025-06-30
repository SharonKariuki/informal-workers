const express = require('express');
const Worker = require('../models/Worker');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const worker = new Worker(req.body);
    await worker.save();
    res.status(201).json({ message: 'Worker registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Worker registration failed', details: err.message });
  }
});

module.exports = router;
