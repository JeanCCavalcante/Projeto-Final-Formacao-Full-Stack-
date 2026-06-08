const mongoose = require('mongoose');

const TaskHistorySchema = new mongoose.Schema({
  task_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  status_anterior: {
    type: String,
    enum: [null, 'pendente', 'andamento', 'concluida'],
    default: null
  },
  status_novo: {
    type: String,
    enum: ['pendente', 'andamento', 'concluida'],
    required: true
  },
  data_mudanca: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TaskHistory', TaskHistorySchema);