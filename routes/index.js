const express = require('express');
const user = require('./user');
const router = express.Router();

const flightRoutes = require('./flight.js')
const airlineRoutes = require('./airline.js')
const airplaneRoutes = require('./airplane.js')
const airportRoutes = require('./airport.js')
const notificationRoutes = require('./notification.js')
const data = require('../prisma/seed/index');

router.use(user);
router.use(flightRoutes);
router.use(airlineRoutes);
router.use(airplaneRoutes);
router.use(airportRoutes);
router.use(notificationRoutes);

router.get('/', (req,res) => {
    return res.status(200).json({
        status: true,
        message: "welcome to api quick tix application in develop"
    })
});

router.get('/admin/data', (req,res) => {
    data();
    return res.status(200).json({
        status: true,
        message: "succes create"
    })
})


module.exports = router;