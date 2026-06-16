const Task = require('../models/Task'); 
const TaskHistory = require('../models/TaskHistory'); 

module.exports = {
  // Listar todas as tarefas vinculadas ao mentorado autenticado
  async index(req, res) {
    try {
      const userId = req.user.id; 
      const tasks = await Task.find({ user_id: userId }); 
      return res.json(tasks);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao listar as tarefas." });
    }
  },

  // Cadastrar uma nova tarefa e registrar o estado inicial de 'pendente' no histórico
  async store(req, res) {
    try {
      const { titulo, descricao, prioridade, mentor_responsavel, data_inicio, mentorado } = req.body;
      const userId = req.user.id;
      let status_atual = 'pendente';

      const newTask = await Task.create({
        titulo,
        descricao,
        prioridade,
        status_atual,
        mentor_responsavel,
        data_inicio,
        mentorado,
        user_id: userId,
        area_atuacao: usuarioLogado.area_atuacao
      });

      // Registra o nascimento da tarefa na história puro, sem campos adicionais
      await TaskHistory.create({
        task_id: newTask._id,
        status_anterior: null,
        status_novo: status_atual,
        data_mudanca: new Date()
      });

      return res.status(201).json(newTask);
    } catch (error) {
      console.error("Erro no salvamento da tarefa:", error);
      return res.status(400).json({ error: "Erro ao criar a tarefa." });
    }
  },

  // Atualizar dados, campos de data e o feedback_conclusao_mentorado diretamente no documento da Task
  async update(req, res) {
    try {
      const { id } = req.params; 
      const { titulo, descricao, prioridade, status_atual, area_atuacao, mentor_responsavel, data_inicio, data_conclusao, feedback_conclusao_mentorado } = req.body;
      const userId = req.user.id;

      const task = await Task.findById(id);

      if (!task) {
        return res.status(404).json({ error: "Tarefa não encontrada." });
      }

      if (task.user_id.toString() !== userId) {
        return res.status(403).json({ error: "Acesso negado." });
      }

      const statusMudou = status_atual && status_atual !== task.status_atual;
      const statusAnterior = task.status_atual;

      // Atualização dos campos textuais e enums
      if (titulo) task.titulo = titulo;
      if (descricao) task.descricao = descricao;
      if (prioridade) task.prioridade = prioridade;
      if (area_atuacao) task.area_atuacao = area_atuacao;
      if (mentor_responsavel) task.mentor_responsavel = mentor_responsavel;
      
      // Modificação direta e livre dos campos de data e do feedback do mentorado
      if (data_inicio !== undefined) task.data_inicio = data_inicio;
      if (data_conclusao !== undefined) task.data_conclusao = data_conclusao;
      if (feedback_conclusao_mentorado !== undefined) task.feedback_conclusao_mentorado = feedback_conclusao_mentorado;
      if (status_atual) task.status_atual = status_atual;

      await task.save();

      // Gravação no Histórico restrita estritamente ao rastreamento da mudança de status
      if (statusMudou) {
        await TaskHistory.create({
          task_id: task._id,
          status_anterior: statusAnterior,
          status_novo: status_atual,
          data_mudanca: new Date()
        });
      }

      return res.json(task);
    } catch (error) {
      console.error("Erro na atualização da tarefa:", error);
      return res.status(500).json({ error: "Erro ao atualizar a tarefa." });
    }
  },

  // Remover uma tarefa do banco de dados
  async delete(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const task = await Task.findById(id);

      if (!task) {
        return res.status(404).json({ error: "Tarefa não encontrada." });
      }

      if (task.user_id.toString() !== userId) {
        return res.status(403).json({ error: "Acesso negado." });
      }

      await task.deleteOne();
      return res.json({ message: "Tarefa removida com sucesso!" });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao remover a tarefa." });
    }
  }
};