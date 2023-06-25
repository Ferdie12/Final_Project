const express = require("express");
const router = express.Router();
const payment = require("../controllers/payment");
const middleware = require("../middleware/auth.js");

router.get('/all', middleware.auth, payment.getAll);
router.get('/checkout', middleware.auth,payment.checkout);

module.exports = router;