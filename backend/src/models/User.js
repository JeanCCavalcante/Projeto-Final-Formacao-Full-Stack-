const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  papel: {
    type: String,
    enum: ['mentorado', 'mentor'],
    default: 'mentorado'
  },
  departamento: {
    type: String,
    enum: ['Tecnologia', 'Produto', 'Marketing', 'Pessoas e Cultura'],
    required: true
  },
   area_atuacao: { 
    type: String, 
    enum: ['DevBack-end', 'QA', 'Produto', 'UX/UIDesigner', 'Data Engineer', 'DevFront-end', 'DevMobile'],
    required: true 
  },
  anos_empresa: {
    type: Number,
    required: true
  },
  formacao_acessibilidade: {
    type: String,
    enum: ['Sim', 'Não'],
    required: true
  }

}, 

{
  timestamps: true 
});

module.exports = mongoose.model('User', UserSchema);