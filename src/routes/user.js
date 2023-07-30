import express from "express";
import user from "../controllers/user.js";
import middleware from "../middleware/auth.js";
import multer from 'multer';

const router = express.Router();

// Membuat instance multer dan mengatur konfigurasi
const upload = multer();

router.get('/tes', middleware.auth, (req, res) => {
    return res.status(200).json({
        data: req.user.name
    })
})

router.post('/auth/register', user.register);
router.post('/validasi', user.activation);
router.get('/sendotp', user.sendOtp);
router.post('/auth/login/google', user.google_login);
router.post('/auth/login', user.login);
router.post('/forgotpassword', user.forgotPassword);
router.post('/resetpassword', user.resetPassword);

// Menggunakan middleware multer sebagai handler untuk route
router.get('/user/get', middleware.auth, user.getUser);
router.put('/user/avatar', middleware.auth, upload.single("media"), user.updateAvatar);
router.put('/user/update', middleware.auth, user.updateProfile);

export default router;
