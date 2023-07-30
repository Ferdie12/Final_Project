import prisma from "../application/database.js";
import ResponseError from "../error/response-error.js";
import qr from "qr-image";
import imagekit from "../utils/imagekit.js";
import sendTicket from "../utils/ticket.js";

const getTicket = async (request, id) => {
    const {order_id} = request

    if(!order_id){
        throw new ResponseError(400, "you must send order_id to generate ticket");
    }

    const check = await prisma.order.findFirst({
        where: {
            AND: [
            {id: +order_id},
            {user_id: id},
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
        throw new ResponseError(400, "invalid generate ticket");
    }

    const tes = await prisma.ticket.findFirst({where:{order_id: check.id}});

    if(tes){
        return {image: tes.url, qr: tes.qr};
    }

    const data = {
        seatClass: check.flight.class,
        from: check.flight.from.city,
        to: check.flight.to.city,
        id: check.booking_code,
        time: check.flight.departure_time,
        date: check.flight.flight_date
    };
    
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

    return {image: ticket.url, qr: ticket.qr};
}

export default getTicket;