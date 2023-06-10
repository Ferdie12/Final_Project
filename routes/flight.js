const express = require('express');
const router = express.Router();
const flight = require('../controller/flight.js')

router.get('/', flight.show)
router.post('/', flight.create)
router.get('/:id', flight.showOne)
router.put('/:id', flight.update)
router.delete('/:id', flight.destroy)

module.exports = router