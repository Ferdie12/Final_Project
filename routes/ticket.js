const express = require('express');
const router = express.Router();
const middleware = require("../middleware/auth.js");
const coba = require('../controllers/ticket');

router.get('/ticket', middleware.auth,coba.getTicket);

module.exports = router;