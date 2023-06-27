const express = require("express");
const router = express.Router();
const order = require("../controllers/order");
const middleware = require("../middleware/auth.js");

router.get('/', middleware.auth, order.getAll);
router.get('/one/:id', middleware.auth,order.getById);
router.post('/create', middleware.auth,order.create);

module.exports = router;