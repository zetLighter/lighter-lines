
const ExpressRouter = require('express');
const expressRouter = new ExpressRouter();
const cartController = require('../controllers/cartController');

expressRouter.get('/', cartController.readByUserCart);
expressRouter.post('/:routeId', cartController.add);
expressRouter.delete('/:routeId', cartController.delete);

module.exports = expressRouter;