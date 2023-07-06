const express = require("express");
const router = express.Router();
const payment = require("../controllers/payment");
const middleware = require("../middleware/auth.js");

router.get('/', middleware.auth, payment.getAll);
router.post('/checkout', middleware.auth,payment.checkout);
router.post('/invoice', middleware.auth, payment.invoice);

module.exports = router;