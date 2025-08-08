require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {  
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                message: "Token not provided!"
            })
        }  
        const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);

        req.userData = { userId: verifiedToken.id, email: verifiedToken.email };
        next();

    } catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
}