 
 const ExpressRouter = require('express');
 const routeController = require('../controllers/routeController');
 const expressRouter = new ExpressRouter();
 const authMiddleware = require('../middleware/authMiddleware');

expressRouter.post('/', authMiddleware, routeController.create);
expressRouter.get('/', routeController.read);
expressRouter.get('/:id', routeController.readById);


 module.exports = expressRouter;