const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

module.exports = {
  //  REGISTRO: Criar um novo user com password encriptografadoo
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // REGRA: Verificar se o email já existe no banco
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ error: "Este e-mail já está cadastrado." });
      }

      // REGRA: Criptografar a senha usando o hash 
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        name,
        email,
        password: hashedPassword
      });

      // Retorna sucesso sem mostrar a senha por segurança
      return res.status(201).json({
        message: "Usuário registrado com sucesso!",
        user: { id: newUser._id, name: newUser.name, email: newUser.email }
      });

    } catch (error) {
      return res.status(500).json({ error: "Erro interno ao registrar o usuário." });
    }
  },

  // LOGIN: Validar acesso e retornar o Token JWT
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // REGRA: Buscar o usuário pelo e-mail
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: "E-mail ou senha incorretos." });
      }

      // REGRA: Comparar a senha digitada com o hash salvo no banco
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: "E-mail ou senha incorretos." });
      }

      // gerar o Token JWT assinado com o JWT_SECRET
      const token = jwt.sign(
        { id: user._id }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' } 
      );

      // Retorna o Token e os dados básicos para o LocalStorage 
      return res.json({
        token,
        user: { name: user.name, email: user.email }
      });

    } catch (error) {
      return res.status(500).json({ error: "Erro interno ao realizar o login." });
    }
  }
};