const express = require('express');
const router = express.Router();
const flight = require('../controllers/admin/flight.js')

router.get('/', flight.getAll);
router.post('/', flight.search);
router.get('/:id', flight.getById);
router.get('/price/:id', flight.getById);


module.exports = router