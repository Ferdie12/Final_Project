import express from "express";
const router = express.Router();
import airport from "../controllers/admin/airport.js";

router.get('/', airport.getAll);
router.get('/:code', airport.getById);

export default router;