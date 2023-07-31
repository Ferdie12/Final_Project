import express from 'express';
import middleware from "../middleware/auth.js";

import user from './user.js';
import flightRoutes from './flight.js';
import airlineRoutes from './airline.js';
import airplaneRoutes from './airplane.js';
import airportRoutes from './airport.js';
import notificationRoutes from './notification.js';
import orderRoutes from './order.js';
import paymentRoutes from './payment.js';
import ticket from './ticket.js';
import data from '../../prisma/seed/flight.js';
import insertData from '../../prisma/seed/index.js';

const router = express.Router();
router.use(user);
router.use(ticket);
router.use(data);
router.use("/flight", flightRoutes);
router.use("/airline",airlineRoutes);
router.use("/airplane", airplaneRoutes);
router.use("/airport", airportRoutes);
router.use("/notif",notificationRoutes);
router.use("/order", orderRoutes);
router.use("/payment", paymentRoutes);


router.get('/', (req,res) => {
    return res.status(200).json({
        status: true,
        message: "welcome to api quick tix application in develop"
    })
});

router.get('/admin/data', middleware.auth, middleware.adminOnly,(req,res) => {
    insertData();
    return res.status(200).json({
        status: true,
        message: "succes create"
    })
});


export default router;