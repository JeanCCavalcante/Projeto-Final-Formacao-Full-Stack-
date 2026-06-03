const mongoose = require('mongoose');

const uri = process.env.MONGO_URI; 

if (!uri) {
  console.error(" Erro: A variável DATABASE_URL não foi definida no arquivo .env");
  process.exit(1);
}

mongoose.connect(uri)
  .then(() => console.log('Conectado com sucesso ao banco [taskinsight] no Atlas'))
  .catch((err) => console.error(' Falha ao conectar ao MongoDB Atlas:', err));

module.exports = mongoose;