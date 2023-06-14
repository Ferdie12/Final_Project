const express = require("express");
const router = express.Router();
const airline = require("../controllers/admin/airline");

router.get('/', airline.getAll)
router.get('/:id_airline', airline.getById)
router.post('/', airline.create)
router.put('/:id_airline', airline.update)
router.delete('/:id_airline', airline.destroy)
module.exports = router;