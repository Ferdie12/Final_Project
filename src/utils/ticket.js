import { createCanvas, loadImage, registerFont } from 'canvas';
import fs from "fs";
import path from "path";

async function sendTicket(data) {
  // Baca file gambar latar belakang secara sinkronous
  const backgroundImageData = fs.readFileSync(path.join(process.cwd() + '/src/utils/ticket.png'));
  const backgroundImage = await loadImage(backgroundImageData);

  // Mendapatkan ukuran gambar latar belakang
  const ticketWidth = backgroundImage.width;
  const ticketHeight = backgroundImage.height;

  // Membuat kanvas dengan ukuran yang sesuai
  const canvas = createCanvas(ticketWidth, ticketHeight);
  const ctx = canvas.getContext('2d');

  // Menggambar latar belakang
  ctx.drawImage(backgroundImage, 0, 0, ticketWidth, ticketHeight);

  // Mengatur properti teks
  ctx.fillStyle = 'black';
  ctx.textBaseline = 'middle';

  // Mendaftarkan font yang diinginkan
  registerFont(path.join(process.cwd() +'/src/utils/Roboto-Regular.ttf'), { family: 'Roboto' });

  // Menggambar teks pada kanvas dengan data tiket
  ctx.font = 'bold 30px Roboto';
  ctx.fillText(data.seatClass, 530, 90);
  ctx.fillText(`${data.id} QX`, 50, 190);
  ctx.fillText(data.from, 50, 290);
  ctx.fillText(data.to, 280, 327);

  ctx.font = 'bold 40px Arial';
  ctx.fillText(data.time, 60, 440);
  ctx.fillText(data.date, 60, 550);

  return canvas.toBuffer();
}

export default sendTicket;
