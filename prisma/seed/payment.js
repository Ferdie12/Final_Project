import prisma from "../../src/application/database.js";
import data_payment from './data/payment_type.json' assert { type: 'json' };;

async function main() {
    const data = await prisma.payment_type.createMany({data: data_payment});
    console.log(data);
}

export default main;