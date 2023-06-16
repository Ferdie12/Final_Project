const express = require('express');
const router = express.Router();
const flight = require('../controllers/admin/flight.js')

router.get('/api/flight', flight.show)
router.post('/api/flight', flight.search)
router.get('/api/flight/:id', flight.showOne)
router.put('/api/flight/:id', flight.update)
router.delete('/api/flight/:id', flight.destroy)

module.exports = router