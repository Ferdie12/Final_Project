import express from "express";
const router = express.Router();
import order from "../controllers/order.js";
import middleware from "../middleware/auth.js";

router.get('/', middleware.auth, order.getAll);
router.get('/one/:id', middleware.auth, order.getById);
router.post('/create', middleware.auth, order.create);

export default router;