import getTicket from "../service/ticket.js";

class Ticket {
    static getTicket = async (req,res,next) => {
        try {
            const result = await getTicket(req.query, req.user.id);

            return res.status(200).json({
                status: true,
                message: "succes generate ticket",
                data: {
                    image: result.image,
                    qr: result.qr
                }
            })
        } catch (error) {
            next(error)
        }
    }
}

export default Ticket;