import prisma from "../../src/application/database.js";
import data_airplane from './data/airplane.json' assert { type: 'json' };;

async function main() {
    const data = await prisma.airplane.createMany({data: data_airplane});
    console.log(data);
}

export default main;