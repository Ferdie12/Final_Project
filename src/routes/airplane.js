import express from "express";
const router = express.Router();
import airplane from "../controllers/admin/airplane.js";

router.get('/', airplane.getAll);
router.get('/:id_airplane', airplane.getById);

export default router;