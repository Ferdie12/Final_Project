import express from "express";
const router = express.Router();
import notification from "../controllers/notification.js";
import middleware from "../middleware/auth.js";

router.get('/', middleware.auth,notification.getAll);
router.get('/:id_notification', middleware.auth,notification.read);

export default router;