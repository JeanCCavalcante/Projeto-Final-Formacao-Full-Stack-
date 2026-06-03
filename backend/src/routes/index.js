const { Router } = require('express');

const authenticateRoutes = require('./authenticateRoutes');
const taskRoutes = require('./task.routes');
const userRoutes = require('./user.routes'); 
const routes = Router();


routes.use('/api/auth', authenticateRoutes);


routes.use('/api/tasks', taskRoutes);

routes.use('/users', userRoutes);

module.exports = routes;