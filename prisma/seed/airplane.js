const prisma = require("../config");
const data_airplane = require('./data/airplane.json');

async function main() {
    const data = await prisma.airplane.createMany({data: data_airplane});
    console.log(data);
}

module.exports = main;