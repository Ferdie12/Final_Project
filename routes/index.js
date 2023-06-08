const express = require('express');
const router = express.Router();
const user = require('../controllers/user');

const middlewares = require('../utils/middlewares');

router.get('/', (req, res) => {
    return res.render('index');
});

router.get('/home', (req, res) => {
    return res.render('home');
});

router.get('/register', user.registerPage);
router.get('/login', user.loginPage);
router.post('/auth/register', user.register);
router.post('/auth/login', user.login);
router.get('/whoami', middlewares.auth, user.whoami);

module.exports = router;