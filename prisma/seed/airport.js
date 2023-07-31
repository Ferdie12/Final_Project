import prisma from "../../src/application/database.js";
import data_airport from './data/airport.json' assert { type: 'json' };;

async function main() {
    const data = await prisma.airport.createMany({data: data_airport});
    console.log(data);
}

export default main;