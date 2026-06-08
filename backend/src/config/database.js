const mongoose = require('mongoose');

const uri = process.env.MONGO_URI; 

if (!uri) {
  console.error(" Erro: A variável MONGO_URI não foi definida no arquivo .env");
  process.exit(1);
}

// A comunicação com a nuvem do MongoDB Atlas
mongoose.connect(uri)
  .then(() => console.log('Conectado com sucesso ao banco [taskinsight] no Atlas'))
  .catch((err) => console.error(' Falha ao conectar ao MongoDB Atlas:', err));

module.exports = mongoose;