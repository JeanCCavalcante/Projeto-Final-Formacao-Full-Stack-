const mongoose = require('mongoose'); 

require('dotenv').config();   
const express = require('express');
const cors = require('cors'); 


require('./config/database'); // Conecta ao MongoDB 

const routes = require('./routes'); 

const app = express();



app.use(cors());              
app.use(express.json());      
app.use(routes);

const PORT = process.env.PORT || 5000; // O back vai rodar na porta 5000 e o front na 3000

app.listen(PORT, () => {
  console.log(`🚀 Servidor ativo em http://localhost:${PORT}`);
});

/* ====== CÓDIGO TEMPORÁRIO PARA LIMPAR O BANCO ======
mongoose.connection.on('connected', async () => {
  try {
    await mongoose.connection.db.dropDatabase();
    console.log("🔥 SUCESSO: Base de dados taskinsight limpa por completo!");
    process.exit(0); // Fecha o terminal após limpar
  } catch (err) {
    console.error("Erro ao limpar o banco:", err);
    process.exit(1);
  }
});*/
