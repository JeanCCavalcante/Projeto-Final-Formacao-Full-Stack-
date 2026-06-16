const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

module.exports = {
  // Criar um novo usuário validando os campos obrigatórios e enums do Schema
  async register(req, res) {
    try {
      const { name, email, password, papel, formacao_acessibilidade, anos_empresa, departamento, area_atuacao } = req.body;

      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ error: "Este e-mail já está cadastrado." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        papel,
        formacao_acessibilidade,
        anos_empresa,
        departamento,
        area_atuacao
      });

      return res.status(201).json({
        message: "Usuário registrado com sucesso!",
        user: { id: newUser._id, name: newUser.name, email: newUser.email, papel: newUser.papel, area_atuacao: newUser.area_atuacao }
      });

    } catch (error) {
      console.error("ALERTA DE ERRO REAL NO REGISTRO:", error);
      return res.status(500).json({ error: "Erro interno ao registrar o usuário." });
    }
  },

  // Validar credenciais de acesso e assinar o Token JWT (válido por 1h)
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: "E-mail ou senha incorretos." });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: "E-mail ou senha incorretos." });
      }

      const token = jwt.sign(
        { id: user._id }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' } 
      );

      return res.json({
        token,
        user: { user_id: user._id, name: user.name, email: user.email, papel: user.papel, area_atuacao: user.area_atuacao }
      });

    } catch (error) {
      console.error("ALERTA DE ERRO REAL NO LOGIN:", error);
      return res.status(500).json({ error: "Erro interno ao realizar o login." });
    }
  }
};