const prisma = require("../prisma/config");
const notification = require('../utils/notif');

module.exports = {
    checkout: async (req,res,next) => {
        try {
            const {order_id, payment_id} = req.body;
            
            if(!order_id || !payment_id){
                return res.status(400).json({
                    status: false,
                    message: "invalid order_id and payment_id"
                })
            };

            const check = await prisma.order.findUnique({
                where: {id: order_id, user_id: req.user.id},
                include: {
                    flight: {
                        select:{
                            from:true,
                            to: true
                        }
                    }
                }
            })

            if(!check){
                return res.status(400).json({
                    status: false,
                    message: "orders in user not found"
                })
            }

            if(check.status == "ISSUED"){
                return res.status(400).json({
                    status: false,
                    message: "orders has been paid"
                })
            }

            const today = new Date();
            const dateToCheck = new Date(order.exp);
            const todayFormatted = today.toISOString().split('T')[0];
            const dateToCheckFormatted = dateToCheck.toISOString().split('T')[0];
            const isToday = dateToCheckFormatted === todayFormatted;

            if(!isToday){
                return res.status(400).json({
                    status: false,
                    message: "your order has benn expired"
                })
            }

            const order = await prisma.order.update({
                data: {payment_type_id: payment_id, status:"ISSUED"},
                where: {id: order_id, user_id:req.user.id},
            });

            const notifData = [{
				title: "Succes Payment",
				description: `you order ticket from ${order.flight.from.name} to ${order.flight.to.name}, total price ${order.total_price}`,
				user_id: req.user.id
			}];

			notification.sendNotif(notifData);

            return res.status(200).json({
                status:true,
                message: "succes payment",
                data: order.status
            })


        } catch (error) {
            next(error)
        }
    },

    getAll: async(req,res,next) =>{
        try {
            const payment = await prisma.payment_type.findMany();

            return res.status(200).json({
                status: true,
                message: "succes getAll Payment",
                data: payment
            })
        } catch (error) {
            next(error)
        }
    }
}