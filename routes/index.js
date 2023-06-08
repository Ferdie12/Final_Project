const express = require('express');
const router = express.Router();
const user = require('../controllers/user');

const middlewares = require('../utils/middlewares');

router.post('/register', user.register);
router.post('/login', user.login);
router.get('/whoami', middlewares.auth, user.whoami);

module.exports = router;