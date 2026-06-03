const Task = require('../models/Task'); 

module.exports = {
  // READ: Listar apenas as tarefas do usuário autenticado
  async index(req, res) {
    try {
      const userId = req.user.id; 
      const tasks = await Task.find({ user: userId }); 
      return res.json(tasks);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao listar as tarefas." });
    }
  },

  // CREATE: Cadastrar uma nova tarefa vinculada ao usuário logado
  async store(req, res) {
    try {
      const { title, description, status } = req.body;
      const userId = req.user.id;

      const newTask = await Task.create({
        title,
        description,
        status,
        user: userId 
      });

      return res.status(201).json(newTask);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao criar a tarefa. Verifique os campos." });
    }
  },

  // UPDATE: Atualizar status ou  tarefa
  async update(req, res) {
    try {
      const { id } = req.params; 
      const { title, description, status } = req.body;
      const userId = req.user.id;

      // Busca a tarefa primeiro para validar a segurança
      const task = await Task.findById(id);

      if (!task) {
        return res.status(404).json({ error: "Tarefa não encontrada." });
      }

      // Verificar se a tarefa pertence a quem está tentando alterar
      if (task.user.toString() !== userId) {
        return res.status(403).json({ error: "Acesso negado. Esta tarefa pertence a outro usuário." });
      }

      // Atualiza os campos enviados
      if (title) task.title = title;
      if (description) task.description = description;
      if (status) task.status = status;

      await task.save();
      return res.json(task);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao atualizar a tarefa." });
    }
  },

  // 4. DELETE: Remover uma tarefa verificando a propriedade
  async delete(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const task = await Task.findById(id);

      if (!task) {
        return res.status(404).json({ error: "Tarefa não encontrada." });
      }

      // Segurança: impede que um usuário delete a tarefa de outro
      if (task.user.toString() !== userId) {
        return res.status(403).json({ error: "Acesso negado. Você não pode deletar esta tarefa." });
      }

      await task.deleteOne();
      return res.json({ message: "Tarefa removida com sucesso!" });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao remover a tarefa." });
    }
  }
};