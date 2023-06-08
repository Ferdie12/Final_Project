const jwt = require('jsonwebtoken');
const {JWT_SECRET_KEY} = process.env;

module.exports = {
    auth: async (req, res, next) => {
        try {
            const {token} = req.headers;
            if (!token) {
                return res.status(401).json({
                    status: false,
                    message: 'you are not authorized!',
                    data: null
                });
            }

            const data = await jwt.verify(token, JWT_SECRET_KEY);
            req.user = {
                id: data.id,
                name: data.name,
                email: data.email
            };

            next();
        } catch (err) {
            next(err);
        }
    }
};