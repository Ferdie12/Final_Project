const express = require("express");
const router = express.Router();
const cont = require("../controllers/airport");

router.get("/search/:search", cont.getPort);
router.get("/indonesia", cont.getIndoAirport);
router.get("/all", cont.getAllAirport);

module.exports = router;
