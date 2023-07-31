import express from "express";
const router = express.Router();
import payment from "../controllers/payment.js";
import middleware from "../middleware/auth.js";

router.get('/', middleware.auth, payment.getAll);
router.post('/checkout', middleware.auth,payment.checkout);
router.post('/invoice', middleware.auth, payment.invoice);

export default router;