const express = require("express");
const router = express.Router();
const airplane = require("../controllers/admin/airplane");

router.get('/', airplane.getAll)
router.get('/:id_airplane', airplane.getById)
router.post('/', airplane.create)
router.put('/:id_airplane', airplane.update)
router.delete('/:id_airplane', airplane.destroy)
module.exports = router;