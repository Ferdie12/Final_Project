

module.exports = {
    activation: async (req,res) => {
    try {
        const token = req.cookies.authorization;
        if (!token) {
            return res.status(403).json({
                status: false,
                message: 'invalid token'
            });
        }

        const data = await jwt.verify(token, JWT_SECRET_KEY);
        req.user = {
            id: data.id,
            otp: data.otp
        }
        next();
    } catch (err) {
        throw err;
    }
}}