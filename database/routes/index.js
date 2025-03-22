const ExpressRouter = require('express');
const expressRouter = new ExpressRouter();
const authMiddleware = require('../middleware/authMiddleware');

const userRouter = require('./userRouter');
const routeRouter = require('./routeRouter');
const cartRouter = require('./cartRouter');

expressRouter.use('/user', userRouter);
expressRouter.use('/routes', routeRouter);
expressRouter.use('/cart', authMiddleware, cartRouter);

module.exports = expressRouter;