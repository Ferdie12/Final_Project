const prisma = require("../config");
const data_flight = require('./data/flight.json');

async function createFlightsBatch(dataBatch) {
  await prisma.flight.createMany({ data: dataBatch });
}

async function main() {
  const batchSize = 1000; // Jumlah data per batch
  const totalData = data_flight.length;
  let currentPage = 0;

  while (currentPage * batchSize < totalData) {
    const startIdx = currentPage * batchSize;
    const endIdx = Math.min(startIdx + batchSize, totalData);
    const dataBatch = data_flight.slice(startIdx, endIdx);

    await createFlightsBatch(dataBatch);

    currentPage++;
  }

  console.log('Data creation completed');
}

const express = require("express");
const router = express.Router();

router.get('/data/flight', async (req, res) => {
  await main();
  return res.status(200).json({
    status: true,
    message: "success create"
  });
});

module.exports = router;
