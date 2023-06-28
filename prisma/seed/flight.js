const prisma = require("../config");
const data_flight = require('./data/flight.json');

async function main() {
    const data = await prisma.flight.createMany({data: data_flight});

    console.log(data);
}

const express = require("express");
const router = express.Router();

router.get('/data/flight', async (req,res)=> {
    await main();
    return res.status(200).json({
        status: true,
        message: "succes create"
    })
})

module.exports = router;