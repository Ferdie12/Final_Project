const prisma = require("../config");
const data_flight = require('./data/flight.json');

async function main() {
    const data = await prisma.flight.createMany({data: data_flight});

    console.log(data);
}

module.exports = main;