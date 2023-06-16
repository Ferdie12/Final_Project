const express = require('express');
const user = require('./user');
const router = express.Router();
const flightRoutes = require('./flight.js')


router.use(user);
router.use(flightRoutes);

router.get('/', (req,res) => {
    return res.status(200).json({
        status: true,
        message: "welcome to api quick tix application in develop"
    })
});


module.exports = router;