import prisma from "../../src/application/database.js";
import data_airline from './data/airline.json'assert { type: 'json' };;

async function main() {
    const data = await prisma.airline.createMany({data: data_airline});
    console.log(data);
}

export default main;