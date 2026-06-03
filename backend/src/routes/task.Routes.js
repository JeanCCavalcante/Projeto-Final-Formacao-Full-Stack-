const { Router } = require('express');

const taskController = require('../controllers/task.Controller.js'); 

const { verifyAuthentication } = require('../middlewares/verifyAuthentication.js'); 

const routes = Router();

routes.use(verifyAuthentication); // para adicionado para que ninguem acesse as rotas sem o tokeen valido


routes.get('/', taskController.index);       // Listar tarefas do usuário autenticado
routes.post('/', taskController.store);     // Criar nova tarefa vinculada ao usuário
routes.put('/:id', taskController.update);   // Atualizar status ou a tarefa
routes.delete('/:id', taskController.delete); // Remover uma tarefa do banc

module.exports = routes;