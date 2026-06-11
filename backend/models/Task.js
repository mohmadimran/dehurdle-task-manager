const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: [true, 'Task title is required'], trim: true },
  description: { type: String, trim: true },
  status: { 
    type: String, 
    enum: {
      values: ['todo', 'in-progress', 'done'],
      message: '{VALUE} is not a supported status'
    }, 
    default: 'todo' 
  },
  dueDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);