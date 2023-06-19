const express = require('express');
const router = express.Router();
const flight = require('../controllers/admin/flight.js')

router.get('/flight', flight.show)
router.post('/flight', flight.search)
router.get('/flight/:id', flight.showOne)
router.put('/flight/:id', flight.update)
router.delete('/flight/:id', flight.destroy)

module.exports = router