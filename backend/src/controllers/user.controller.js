const UserModel = require('../models/User.js');
const bcrypt = require('bcryptjs');

// LISTAR USUÁRIOS (Mantido seu padrão)
const list = async (req, res) => {
  try {
    const users = await UserModel.find({}, { password: 0 }); 
    return res.json(users);
  } catch (err) {
    return res.status(400).json({ error: "@users/list", message: "Error listing users" });
  }
};

// BUSCAR POR ID 
const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findById(id, { password: 0 });

    if (!user) {
      return res.status(400).json({
        error: "@users/getById",
        message: `User not found with id ${id}`
      });
    }

    return res.json(user);
  } catch (err) {
    return res.status(400).json({
      error: "@users/getById",
      message: `User not found with id ${id}`
    });
  }
};

// CRIAR USUÁRIO 
const create = async (req, res) => {
  const { name, email, password } = req.body; 

  try {
    // REQUISITO: Verificar se o e-mail já existe no banco antes de criar
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "@users/create", message: "This email is already registered." });
    }

    //  Gerar Hash para encriptografa a senha 
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword, // Salva a senha criptografada
    });

    // SEGURANÇA: Retorna o objeto criado, mas oculta a senha na resposta
    const userResponse = { id: user._id, name: user.name, email: user.email };
    return res.status(201).json(userResponse);

  } catch (err) {
    return res.status(400).json({
      error: "@users/create",
      message: err.message || "Error creating user"
    });
  }
};

// ATUALIZAR USUÁRIO 
const update = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body; // Removido o 'age', pois não existe no Schema

  try {
    const updateData = { name, email };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const userUpdated = await UserModel.findByIdAndUpdate(id, updateData, { new: true }).select('-password');

    if (!userUpdated) {
      throw new Error();
    }

    return res.json(userUpdated);
  } catch (err) {
    return res.status(400).json({
      error: "@users/update",
      message: err.message || `Error updating user with id ${id}`
    });
  }
};

// DELETAR USUÁRIO 
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const userDeleted = await UserModel.findByIdAndDelete(id);

    if (!userDeleted) {
      throw new Error();
    }
    return res.status(200).json({ message: `User deleted successfully ${id}` });
  } catch (err) {
    return res.status(400).json({
      error: "@users/deleteUser", 
      message: err.message || `Users not found ${id}`
    });
  }
};


module.exports = {
  list,
  getById,
  create,
  update,
  deleteUser,
};