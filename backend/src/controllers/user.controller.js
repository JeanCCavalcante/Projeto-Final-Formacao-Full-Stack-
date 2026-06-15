const UserModel = require('../models/User.js');
const bcrypt = require('bcryptjs');

// Listar todos os usuários cadastrados ocultando as senhas
const list = async (req, res) => {
  try {
    const users = await UserModel.find({}, { password: 0 }); 
    return res.json(users);
  } catch (err) {
    return res.status(400).json({ error: "@users/list", message: "Error listing users" });
  }
};

// Buscar os dados de um usuário específico utilizando o ID do parâmetro
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

/* CRIAR USUÁRIO substituída pelo método 'register' no auth.controller */

// Atualizar o perfil dinamicamente forçando os validadores de ENUM do Mongoose
const update = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, papel, formacao_acessibilidade, anos_empresa, departamento, area_atuacao } = req.body; 

  try {
    const updateData = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (papel) updateData.papel = papel;
    if (formacao_acessibilidade) updateData.formacao_acessibilidade = formacao_acessibilidade;
    if (anos_empresa !== undefined) updateData.anos_empresa = anos_empresa;
    if (departamento) updateData.departamento = departamento;
    if (area_atuacao) updateData.area_atuacao = area_atuacao;

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const userUpdated = await UserModel.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    ).select('-password');

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

// Remover permanentemente um usuário do banco de dados
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
  //create,
  update,
  deleteUser,
};