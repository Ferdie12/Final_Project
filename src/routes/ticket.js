import express from 'express';
const router = express.Router();
import middleware from "../middleware/auth.js";
import coba from '../controllers/ticket.js';

router.get('/ticket', middleware.auth, coba.getTicket);

export default router;