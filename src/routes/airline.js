import express from "express";
const router = express.Router();
import airline from "../controllers/admin/airline.js";

router.get('/', airline.getAll);
router.get('/:code', airline.getById);

export default router;