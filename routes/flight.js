const express = require('express');
const router = express.Router();
const flight = require('../controllers/admin/flight.js')

router.get('/', flight.getAll);
router.post('/', flight.search);

module.exports = router