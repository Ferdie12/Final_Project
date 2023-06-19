const prisma = require("../config");
const data_airport = require('./data/airport.json');

async function main() {
    const data = await prisma.airport.createMany({data: data_airport});
    console.log(data);
}

module.exports = main;