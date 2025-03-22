const sequelize = require('../db');
const {DataTypes} = require('sequelize');

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    username: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING}
});
const Route = sequelize.define('route', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    from: {type: DataTypes.STRING},
    to: {type: DataTypes.STRING},
    price: {type: DataTypes.FLOAT},
    dateTime: {type: DataTypes.DATE},
    imageName: {type: DataTypes.STRING},
    shortDescription: {type: DataTypes.STRING},
    fullDescription: {type: DataTypes.STRING}
});
const Cart = sequelize.define('cart', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
})
const CartRoute = sequelize.define('cart_route', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.hasMany(CartRoute);
CartRoute.belongsTo(Cart);

Route.hasMany(CartRoute);
CartRoute.belongsTo(Route);

module.exports = {
    User, Cart, Route, CartRoute
}