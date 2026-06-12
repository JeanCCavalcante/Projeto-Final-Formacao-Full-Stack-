const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  titulo: { 
    type: String, 
    required: true 
  },
  descricao: { 
    type: String, 
    required: true 
  },
  
  // O enum restringe os valores aceitos, blindando o banco contra erros 
  // de digitação e garantindo dados limpos para a análise em Python.
  prioridade: { 
    type: String, 
    enum: ['baixa', 'media', 'alta'], 
    default: 'media' 
  },
  status_atual: { 
    type: String, 
    enum: ['pendente', 'andamento', 'concluida'], 
    default: 'pendente' 
  },
   
  //O tipo Date nativo permite que a equipe de dados calcule prazos, 
  // gargalos e tempos de entrega de forma matemática (subtraindo datas).
  data_inicio: { 
    type: Date 
  },
  data_conclusao: { 
    type: Date 
  },
  feedback_conclusao_mentorado: {
    type: String
  },

  /*mentorado: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },*/

  mentorado: { type: String },

  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  mentor_responsavel: {
    type: String,
    required: true
  }
}, {
  //Cria automaticamente as colunas 'createdAt' e 'updatedAt' na gravação.
  timestamps: true 
});

module.exports = mongoose.model('Task', TaskSchema);