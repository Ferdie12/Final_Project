const express = require('express');
const router = express.Router();
const flight = require('../controllers/admin/flight.js')

router.get('/', flight.getAll);
router.post('/search', flight.search);
router.get('/:id', flight.getById);
router.get('/price/:id', flight.getByIdPrice);


module.exports = router