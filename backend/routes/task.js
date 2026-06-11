const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// POST /tasks - Create a task
router.post('/', auth, async (req, res) => {
  const { title, description, status, dueDate } = req.body;
  try {
    const task = new Task({
      user: req.user.userId,
      title,
      description,
      status,
      dueDate
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /tasks - List user tasks (with filter support)
router.get('/', auth, async (req, res) => {
  try {
    const filter = { user: req.user.userId };
    if (req.query.status) {
      filter.status = req.query.status;
    }
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Server error retrieving tasks' });
  }
});

// PATCH /tasks/:id - Update explicit fields
router.patch('/:id', auth, async (req, res) => {
  try {
    let task = await Task.findOne({ _id: req.params.id, user: req.user.userId });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    // Explicitly update only allowed fields passed in body
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description', 'status', 'dueDate'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) return res.status(400).json({ error: 'Invalid updates specified' });

    updates.forEach(update => task[update] = req.body[update]);
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /tasks/:id - Remove task cleanly
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error removing task' });
  }
});

module.exports = router;