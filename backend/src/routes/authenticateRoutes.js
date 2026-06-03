const { Router } = require('express');


const authenticateController = require('../controllers/authenticateControllers.js');
const userController = require('../controllers/user.controller.js'); 

const routes = Router();

routes.post('/register', userController.create);

// chama o método login que valida credenciais e gera o JWT
routes.post('/login', authenticateController.login);

module.exports = routes;