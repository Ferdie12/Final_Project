const express = require("express");
const router = express.Router();
const airline = require("../controllers/admin/airline");

router.get('/', airline.getAll);
router.get('/:code', airline.getById);

module.exports = router;