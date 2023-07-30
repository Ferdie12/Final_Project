import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const {JWT_SECRET_KEY} = process.env;

class Auth {
    static auth = async (req, res, next) => {
        try {
            const {authorization} = req.headers;

            if (!authorization) {
                return res.status(401).json({
                    status: false,
                    message: 'you\'re not authorized!',
                    data: null
                });
            }

            console.log(JWT_SECRET_KEY);

            const data = await jwt.verify(authorization, JWT_SECRET_KEY);
            req.user = {
                id: data.id,
                name: data.name,
                email: data.email,
                role: data.role
            };

            next();
        } catch (err) {
            next(err);
        }
    }

    static adminOnly = (req, res, next) => {
        let role = req.user.role
        role = role === 'admin' ? next() : res.status(403).json({
            status: false,
            message: 'you\'re not authorized!',
            data: null
        });
    }
};

export default Auth;