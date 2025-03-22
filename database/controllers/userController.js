const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User, Cart} = require('../model/models');

const generateJwt = (id, email, username) => {
    return jwt.sign({id, email, username}, process.env.JWT_KEY, {expiresIn: '1h'});

}

class UserController {
    async registration (request, response, next) {
        let {email, username, password} = request.body;
        if (!email || !password || !username) {
            return next(ApiError.badRequest('Not all fields are filled in correctly.'));
        }
        if (!email.includes('@')) {
            return next(ApiError.badRequest('Uncorrect type for email.'));
        }
        const itExistsByEmail = await User.findOne({where: {email: email.toLowerCase()}});
        const itExistsByUsername = await User.findOne({where: {username: username.toLowerCase()}});
        if (itExistsByEmail || itExistsByUsername) {
            return next(ApiError.forbidden('A user with this email or username already exists.'));
        }
        const hashedPassword = await bcrypt.hash(password, 7);
        const user = await User.create({email: email.toLowerCase(), username: username.toLowerCase(), password: hashedPassword});
        const cart = await Cart.create({userId: user.id});
        const token = generateJwt(user.id, email, username);
        response.json({token});
    }
    async login (request, response, next) {
        const {email, username, password} = request.body;
        console.log(email, username, password);
        if (email && password) {
            const itExists = await User.findOne({where: {email: email.toLowerCase()}});
            if (!itExists) {
                return next(ApiError.internal('User with this email not exists.'));
            }
            const comparedPassword = bcrypt.compareSync(password, itExists.password);
            if (!comparedPassword) {
                return next(ApiError.internal('Incorrect password.'));
            }
            const token = generateJwt(itExists.id, email, itExists.username);
            return response.json({token});
        } else if (username && password) {
            const itExists = await User.findOne({where: {username: username.toLowerCase()}});
            if (!itExists) {
                return next(ApiError.internal('User with this username not exists.'));
            }
            const comparedPassword = bcrypt.compareSync(password, itExists.password);
            if (!comparedPassword) {
                return next(ApiError.internal('Incorrect password.'));
            }
            const token = generateJwt(itExists.id, itExists.email, username);
            return response.json({token});
        } else if ((!email && !username) && !password) {
            return next(ApiError.badRequest('Incorrect login or password.'));
        }
    } 
    async auth(request, response) {
        const {user} = request;
        const token = generateJwt(user.id, user.email, user.username);
        return response.json({token});
    }
    isAuth(request, response) {
        response.json({isAuth: true});
    }
}

module.exports = new UserController();