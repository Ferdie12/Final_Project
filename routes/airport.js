const express = require("express");
const router = express.Router();
const airport = require("../controllers/airport");

router.get('/', airport.show)
router.post('/', airport.create)
router.put('/:id', airport.update)
router.delete('/:id', airport.destroy)
module.exports = router;
