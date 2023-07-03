const prisma = require("../config");
const data_payment = require('./data/payment_type.json');

async function main() {
    const data = await prisma.payment_type.createMany({data: data_payment});
    console.log(data);
}

module.exports = main;