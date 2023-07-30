import userService from "../service/user.js";

class User {
    static register = async (req, res, next) => {
        try {
            const result = await userService.register(req.body);
          
            return res.status(201).json({
                status: true,
                message: result.message,
                data: result.data
            })

        } catch (error) {
            next(error);
        }
    };

    static login = async (req, res, next) => {
        try {
           const result = await userService.login(req.body);

            return res.status(200).json({
                status: true,
                message: 'login success!',
                data: result
            });

        } catch (error) {
            next(error);
        }
    };

    static google_login = async (req, res, next) => {
        try {
            const result = await userService.loginGoogle(req.body);

            return res.status(200).json({
                status: true,
                message: 'login success!',
                data: result
            });
        } catch (error) {
            next(error)
        }
    };

    static activation = async (req,res,next) => {
        try {
            const result = await userService.activation(req.body);

            return res.status(200).json({
                status: true,
                message: result
            });
        } catch (err) {
            next(err);
        }
    };

    static sendOtp =  async (req,res,next) => {
        try {
            const result = await userService.sendOtp(req.query);

            return res.status(200).json({
                status: true,
                message: result
            });
        } catch (err) {
            next(err);
        }
    };

    static forgotPassword = async (req,res,next) => {
        try {
            const result = await userService.forgotPassword(req.query);

            return res.status(200).json({
                status: true,
                message: result
            });
        } catch (err) {
            next(err);
        }
    };

    static resetPassword = async (req,res,next) => {
        try {
            const result = await userService.resetPassword(req.body, req.query.token);

            return res.status(200).json({
                status: true,
                message: result
            });
        } catch (err) {
            next(err);
        }
    };

    static getUser = async (req,res,next) => {
        try {
            const result = await userService.getUser(req.user.id);

            return res.status(200).json({
                status: true,
                message: "succes get user",
                data: result
            });
        } catch (err) {
            next(err);
        }
    };

    static updateAvatar = async (req,res,next) => {
        try {
            const result = await userService.updateAvatar(req.user);

            return res.status(200).json({
                status: true,
                message: "succes update avatar",
                data: result
            });
        } catch (err) {
            next(err);
        }
    };

    static updateProfile = async (req,res,next) => {
        try {
            const result = await userService.updateProfile(req.body, req.user.id);

            return res.status(200).json({
                status: true,
                message: result
            });
        } catch (err) {
            next(err);
        }
    };
};

export default User;