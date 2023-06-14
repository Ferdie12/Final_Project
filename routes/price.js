const express = require("express");
const router = express.Router();
const price = require("../controllers/admin/price");

router.get('/', price.getAll)
router.get('/:id_price', price.getById)
router.post('/', price.create)
router.put('/:id_price', price.update)
router.delete('/:id_price', price.destroy)
module.exports = router;