const prisma = require("../config");
const data_airline = require('./data/airline.json');

async function main() {
    const data = await prisma.airline.createMany({data: data_airline});
    console.log(data);
}

main()