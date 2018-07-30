const jwt = require('jsonwebtoken');
const secret = require('../config').auth.tokenSecret;

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, secret);
        req.userID = decoded.userID; //по идее достаточно _id
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};