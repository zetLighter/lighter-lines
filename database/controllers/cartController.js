const {Cart} = require('../model/models');
const {CartRoute} = require('../model/models');
const bcrypt = require('bcrypt');

class CartController {
    async readByUserCart (request, response) {
        const userId = request.user.id;
        const userCart = await Cart.findOne({where: {userId: userId}});
        const cartId = userCart.id;

        const userCartRoutes = await CartRoute.findAll({where: {cartId: cartId}})
        response.json(userCartRoutes);
    }
    async add (request, response) {
        const routeId = request.params.routeId;
        const userId = request.user.id;

        const userCart = await Cart.findOne({where: {userId: userId}});
        const cartId = userCart.id;

        const cartRoute = await CartRoute.create({cartId, routeId});
        response.json(cartRoute);
    }
    async delete (request, response) {
        const routeId = request.params.routeId;
        const userId = request.user.id;

        const userCart = await Cart.findOne({where: {userId: userId}});
        const cartId = userCart.id;

        const deletedCartRoute = await CartRoute.destroy({where: {cartId, routeId}});
        response.json(deletedCartRoute);
    }
}

module.exports = new CartController();