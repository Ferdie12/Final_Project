const express = require("express");
const router = express.Router();
const airport = require("../controllers/admin/airport");

router.get('/', airport.getAll);
router.get('/:code', airport.getById);

module.exports = router;