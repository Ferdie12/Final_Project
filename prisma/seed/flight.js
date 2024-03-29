import prisma from "../../src/application/database.js";
import data_flight from './data/flight.json' assert { type: 'json' };;
import middleware from '../../src/middleware/auth.js';

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

import express from "express";
const router = express.Router();

router.get('/data/flight', middleware.auth, middleware.adminOnly,async (req, res) => {
  await main();
  return res.status(200).json({
    status: true,
    message: "success create"
  });
});

export default router;
