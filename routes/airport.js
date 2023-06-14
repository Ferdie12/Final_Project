const express = require("express");
const router = express.Router();
const airport = require("../controllers/admin/airport");

router.get('/', airport.getAll)
router.get('/:id_airport', airport.getById)
router.post('/', airport.create)
router.put('/:id_airport', airport.update)
router.delete('/:id_airport', airport.destroy)
module.exports = router;