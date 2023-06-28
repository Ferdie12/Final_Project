const prisma = require("../prisma/config");
const sendTicket = require('../utils/ticket.js');
const imagekit = require('../utils/imagekit');

module.exports = {
    getTicket: async (req,res) => {
        try {
            const {order_id} = req.body

            if(!order_id){
                return res.status(400).json({
                    status: false,
                    message: "you must send order_id to generate ticket"
                })
            }

            const check = await prisma.order.findFirst({
                where: {
                    AND: [
                    {id: order_id},
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
                    message: "invalid request"
                })
            }

            const tes = await prisma.ticket.findFirst({where:{order_id: check.id}});

            if(tes){
                return res.status(200).json({
                    status: true,
                    message: "succes generate ticket",
                    data: tes.url
                })
            }

            const data = {
                seatClass: check.flight.class,
                from: check.flight.from.city,
                to: check.flight.to.city,
                id: check.id,
                time: check.flight.departure_time,
                date: check.flight.flight_date
            }
            const stringFile = await sendTicket(data);

                const uploadFilePng = await imagekit.upload({
                    fileName: `Ticket_flight_${check.id}`,
                    file: stringFile
                });

            const ticket = await prisma.ticket.create({data: {order_id: check.id, url: uploadFilePng.url}});

            return res.status(200).json({
                status: true,
                message: "succes generate ticket",
                data: ticket.url
            })
        } catch (error) {
            throw error
        }
    }
}