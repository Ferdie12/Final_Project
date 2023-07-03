const express = require("express");
const router = express.Router();
const airplane = require("../controllers/admin/airplane");

router.get('/', airplane.getAll);
router.get('/:id_airplane', airplane.getById);

module.exports = router;