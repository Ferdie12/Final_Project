const express = require("express");
const router = express.Router();
const payment = require("../controllers/payment");

router.get('/', payment.show)
router.post('/payment', payment.create)

module.exports = router;