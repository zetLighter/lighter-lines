const jwt = require('jsonwebtoken');

module.exports = function (request, response, next) {
    if (request.method === "OPTIONS") {
        next();
    }
    try {
        const token = request.headers.authorization.split(' ')[1];
        if (!token) {
            return response.status(401).json({message: "Not authorized."});
        }
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        request.user = decoded;
        next();
    } catch (error) {
        response.status(401).json({message: "Not authorized."});
    }
}