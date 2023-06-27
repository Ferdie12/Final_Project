const express = require("express");
const user = require("../controllers/user.js");
const middleware = require("../middleware/auth.js");
const multer = require('multer')();

const router = express.Router();

router.get('/tes', middleware.auth, (req,res) =>{
    return res.status(200).json({
        data: req.user.name
    })
})

router.post('/auth/register', user.register);
router.post('/validasi', user.activation);
router.get('/sendotp', user.sendOtp);
router.get('/auth/login/google', user.google_login);
router.post('/auth/login', user.login);
router.put('/avatar', middleware.auth, multer.single("media"), user.updateAvatar);
router.put('/update', middleware.auth, user.updateProfile);
router.post('/forgotpassword', user.forgotPassword);
router.post('/resetpassword', user.resetPassword);

module.exports = router;