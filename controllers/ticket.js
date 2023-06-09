const prisma = require("../prisma/config");
const sendTicket = require('../utils/ticket.js');
const qr = require('qr-image');
const imagekit = require('../utils/imagekit');

module.exports = {
    getTicket: async (req,res) => {
        try {
            const {order_id} = req.query

            if(!order_id){
                return res.status(400).json({
                    status: false,
                    message: "you must send order_id to generate ticket"
                })
            }

            const check = await prisma.order.findFirst({
                where: {
                    AND: [
                    {id: +order_id},
                    {user_id: req.user_id},
                    {status: "ISSUED"}
                    ]
                },
                include: {
                    flight: {
                        select: {
                        departure_time: true,
                        class: true,
                        flight_date: true,
                        from: true,
                        to: true
                        }
                    }
                }
            });

            if(!check){
                return res.status(400).json({
                    status: false,
                    message: "invalid generate ticket"
                })
            }

            const tes = await prisma.ticket.findFirst({where:{order_id: check.id}});

            if(tes){
                return res.status(200).json({
                    status: true,
                    message: "succes generate ticket",
                    data: {
                        image: tes.url,
                        qr: tes.qr
                    }
                })
            }

            const data = {
                seatClass: check.flight.class,
                from: check.flight.from.city,
                to: check.flight.to.city,
                id: check.booking_code,
                time: check.flight.departure_time,
                date: check.flight.flight_date
            }
            let stringFile = await sendTicket(data);
            stringFile = stringFile.toString('base64');

                const uploadFilePng = await imagekit.upload({
                    fileName: `Ticket_flight_${check.id}`,
                    file: stringFile
                });
            
            const qrBuffer = await qr.imageSync(uploadFilePng.url, 'L');
            const qrString = qrBuffer.toString('base64');
    
                const qrFile = await imagekit.upload({
                    fileName: `qr_${check.id}`,
                    file: qrString
                });

            const ticket = await prisma.ticket.create({data: {order_id: check.id, url: uploadFilePng.url, qr:qrFile.url}});

            return res.status(200).json({
                status: true,
                message: "succes generate ticket",
                data: {
                    image: ticket.url,
                    qr: ticket.qr
                }
            })
        } catch (error) {
            throw error
        }
    }
}