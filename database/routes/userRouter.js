const ExpressRouter = require('express');
const expressRouter = new ExpressRouter();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

expressRouter.post('/registration', userController.registration);
expressRouter.post('/login', userController.login);
expressRouter.get('/auth', authMiddleware, userController.auth);
expressRouter.get('/isAuth', authMiddleware, userController.isAuth)

module.exports = expressRouter;