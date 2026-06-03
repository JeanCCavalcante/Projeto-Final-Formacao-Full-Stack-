const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pendente', 'em andamento', 'concluída'], 
    default: 'pendente' 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  }
}, {
  timestamps: true // Cria o createdAt e updatedAt 
});

module.exports = mongoose.model('Task', TaskSchema);