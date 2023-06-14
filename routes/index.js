const express = require('express');
const user = require('./user');
const router = express.Router();
const flightRoutes = require('./flight.js')
const airlineRoutes = require('./airline.js')
const airplaneRoutes = require('./airplane.js')
const airportRoutes = require('./airport.js')
const notificationRoutes = require('./notification.js')
const priceRoutes = require('./price.js')
module.exports = {
    flightRoutes,
    airlineRoutes,
    airplaneRoutes,
    airportRoutes,
    notificationRoutes,
    priceRoutes
}

router.use(user);

router.get('/', (req,res) => {
    return res.render("home.ejs");
});

router.get('/welcome', (req,res) => {
    return res.render("welcome.ejs");
})

router.get('/login', (req,res) => {
    return res.render("login.ejs");
})

router.get('/loging', (req,res) => {
    return res.render("google.ejs");
})

router.get('/forgot', (req,res) => {
    return res.render("forgot.ejs");
})

router.get('/reset', (req,res) => {
    return res.render("reset.ejs");
})


module.exports = router;