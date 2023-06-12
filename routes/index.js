const express = require('express');
const user = require('./user');
const router = express.Router();
const flightRoutes = require('./flight.js')
module.exports = {
    flightRoutes
}

router.use(user);

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