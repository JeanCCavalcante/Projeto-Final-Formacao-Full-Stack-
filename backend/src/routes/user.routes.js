const { Router } = require('express');
const userController = require('../controllers/user.controller.js');

const userRoutes = Router();


userRoutes.post('/', userController.create);
userRoutes.get('/', userController.list);
userRoutes.get('/:id', userController.getById);
userRoutes.put('/:id', userController.update);
userRoutes.delete('/:id', userController.deleteUser);

module.exports = userRoutes;