import express from 'express';
const router = express.Router();
import middleware from '../middleware/auth.js';
import flight from '../controllers/admin/flight.js';
import go from '../controllers/destination.js';

router.get('/', flight.getAll);
router.post('/search', flight.search);
router.get('/price/:id', middleware.auth, flight.getByIdPrice);
router.get('/destination', go.getDestination);


export default router;