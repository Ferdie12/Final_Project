import prisma from "../application/database.js";
import ResponseError from "../error/response-error.js";
import notification from "../utils/notif.js";
import nodemailer from "../utils/nodemailer.js";
import format from "../utils/format.js";

class Payment {
    static getAll = async () =>{
      const payment = await prisma.payment_type.findMany();
      return payment;
    }
    static checkout = async (request, user) => {
        const {order_id, payment_id} = request;
            
        if(!order_id || !payment_id){
            throw new ResponseError(400, "invalid order_id and payment_id");
        };

        const check = await prisma.order.findFirst({
            where: {
            AND:[
                {id: order_id},
                {user_id: user.id}
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
            throw new ResponseError(400, "orders in user not found");
        }

        if(check.status == "ISSUED"){
            throw new ResponseError(400, "orders has been paid");
        }

        const today = new Date();
        const dateToCheck = new Date(check.exp);
        const todayFormatted = today.toISOString().split('T')[0];
        const dateToCheckFormatted = dateToCheck.toISOString().split('T')[0];
        const isToday = dateToCheckFormatted >= todayFormatted;

        if(!isToday){
            throw new ResponseError(400, "your order has benn expired");
        }

        const order = await prisma.order.update({
            data: {payment_type_id: payment_id, status:"ISSUED"},
            where: {id: order_id},
        });

        const notifData = {
                  title: `Succes Payment with Booking Code ${check.booking_code}`,
                  description: `you order ticket from ${check.flight.from.name} to ${check.flight.to.name}, total price ${format.currency(check.total_price)}`,
                  user_id: user.id
              };

        notification(notifData);
        const html = await nodemailer.getHtml('email/notification.ejs', {user: {name: user.name, subject: notifData.title, description: notifData.description}});
        nodemailer.sendMail(user.email, 'Succes Payment', html);

        return order.status;

    }; 

    static invoice = async (request, id) => {
        const { order_id, payment_id } = request;
      
          if (!order_id && !payment_id) {
            throw new ResponseError(400, "Invalid to access invoice data");
          }
      
          const orders = await prisma.order.findFirst({
            where: {
              AND: [{ id: order_id }, { user_id: id }],
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
            throw new ResponseError(400, "Invalid to access invoice order");
          }
      
          const payment = await prisma.payment_type.findUnique({
            where: { id: payment_id },
          });
      
          if (!payment) {
            throw new ResponseError(400, "Invalid to access invoice payment");
          }
      
          const passengers = await prisma.passenger.findMany({
            where: { order_id: orders.id },
            select: { person: true, fullname: true },
          });
      
              let adult = 0;
              let child = 0;
              const penumpangDewasa = passengers
                .filter((passenger) => passenger.person === 'adult')
                .map((passenger) => {
                  adult++
                  return { penumpang: passenger.fullname }
                });
    
              const penumpangAnak = passengers
                .filter((passenger) => passenger.person === 'child')
                .map((passenger) => {
                  child++
                  return { penumpang: passenger.fullname }
                });
      
       
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

        return result;
    }
    
};

export default Payment;