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

            const check = await prisma.order.findFirst({
                where: {
                AND:[
                    {id: order_id},
                    {user_id: req.user.id}
                ]},
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
            const dateToCheck = new Date(check.exp);
            const todayFormatted = today.toISOString().split('T')[0];
            const dateToCheckFormatted = dateToCheck.toISOString().split('T')[0];
            const isToday = dateToCheckFormatted >= todayFormatted;

            if(!isToday){
                return res.status(400).json({
                    status: false,
                    message: "your order has benn expired"
                })
            }

            const order = await prisma.order.updateMany({
                data: {payment_type_id: payment_id, status:"ISSUED"},
                where: {id: order_id, user_id:req.user.id},
            });

            const notifData = {
				title: "Succes Payment",
				description: `you order ticket from ${check.flight.from.name} to ${check.flight.to.name}, total price ${check.total_price}`,
				user_id: req.user.id
			};

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
    },

    invoice: async (req, res, next) => {
        try {
          const { order_id, payment_id } = req.body;
      
          if (!order_id && !payment_id) {
            return res.status(400).json({
              status: false,
              message: "Invalid to access invoice data",
            });
          }
      
          const orders = await prisma.order.findFirst({
            where: {
              AND: [{ id: order_id }, { user_id: req.user.id }],
            },
            include: {
              flight: {
                select: {
                  price: true,
                },
              },
            },
          });
      
          if (!orders) {
            return res.status(400).json({
              status: false,
              message: "Invalid to access invoice order",
            });
          }
      
          const payment = await prisma.payment_type.findUnique({
            where: { id: payment_id },
          });
      
          if (!payment) {
            return res.status(400).json({
              status: false,
              message: "Invalid to access invoice payment",
            });
          }
      
          const passengers = await prisma.passenger.findMany({
            where: { order_id: orders.id },
            select: { person: true, fullname: true },
          });
      
          let adult = 0;
              let child = 0;
              const penumpangDewasa = passengers
                .filter((passenger) => passenger.person === 'adult')
                .map((passenger) => ({ penumpang: passenger.fullname }));
    
              const penumpangAnak = passengers
                .filter((passenger) => passenger.person === 'child')
                .map((passenger) => ({ penumpang: passenger.fullname }));
      
       
          const adult_price = adult * orders.flight.price;
          const child_price = child * orders.flight.price;
          const tax = Math.floor(0.1 * orders.flight.price);
          const total_price =
            orders.total_passengers * orders.flight.price + tax;
      
          const result = {
            booking_code: orders.booking_code,
            payment: payment.name,
            penumpangDewasa,
            penumpangAnak,
            info_price: {
              adult_total: adult,
              child_total: child,
              adult_price,
              child_price,
              tax,
              total_price,
            },
          };
      
          return res.status(200).json({
            status: true,
            message: "Success get invoice",
            data: result,
          });
        } catch (error) {
          next(error);
        }
      }
      
}