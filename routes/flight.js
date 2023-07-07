const express = require('express');
const router = express.Router();
const middleware = require('../middleware/auth');
const flight = require('../controllers/admin/flight.js');
const go = require('../controllers/destination.js');

router.get('/', flight.getAll);
router.post('/search', flight.search);
router.get('/one/:id', flight.getById);
router.get('/price/:id', middleware.auth, flight.getByIdPrice);
router.get('/destination', go.getDestination);


module.exports = router