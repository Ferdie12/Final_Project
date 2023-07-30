import prisma from "../application/database.js";
import crypto from "crypto";
import ResponseError from "../error/response-error.js";
import passengerValidation from "../validation/order-validation.js";
import validate from "../validation/validation.js";

class Order {
    static getAll = async (id) => {
        const orders = await prisma.order.findMany({
            where: { user_id: id },
            include: {
              flight: {
                select: {
                  departure_time: true,
                  arrival_time: true,
                  class: true,
                  price: true,
                  flight_duration: true,
                  flight_date: true,
                  airplane: true,
                  airline: true,
                  from: true,
                  to: true
                }
              }
            },
            orderBy: [
              {id: 'desc'}
            ]
          });
    
          const result = await Promise.all(
            orders.map(async (order) => {
              const passengers = await prisma.passenger.findMany({
                where: { order_id: order.id },
                select: { person: true, fullname: true }
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
    
              const adult_price = adult * order.flight.price;
              const child_price = child * order.flight.price;
              const tax = Math.floor(0.1 * order.flight.price);
              const total_price =
                order.total_passengers * order.flight.price + tax;
    
              return {
                id: order.id,
                booking_code: order.booking_code,
                booking_status: order.status,
                flight_class: order.flight.class,
                flight_duration: order.flight.flight_duration,
                info_departure_airport: {
                  departure_time: order.flight.departure_time,
                  date: order.flight.flight_date,
                  departure_airport: order.flight.from.name
                },
                info_flight: {
                  airline_name: order.flight.airline.name,
                  class: order.flight.class,
                  airplane_code: order.flight.airplane.airplane_code,
                  logo: order.flight.airline.logo
                },
                penumpangDewasa,
                penumpangAnak,
                info_arrival_airport: {
                  arrival_time: order.flight.arrival_time,
                  date: order.flight.flight_date,
                  arrival_airport: order.flight.to.name
                },
                info_price: {
                  adult_total: adult,
                  child_total: child,
                  adult_price,
                  child_price,
                  tax,
                  total_price
                }
              };
            })
          );
        
        return result;
    }

    static create = async (request, id) => {
        const {flight_id, data_passengers, passengers} = request;
        const {adult=0, child=0} = passengers
        const total_passengers = adult + child;

        if(!flight_id || !data_passengers || !passengers){
            throw new ResponseError(400, "input data not valid");
        }

        const check = validate(passengerValidation, request);

        if(!check){
            throw new ResponseError(400, "something wrong");
        }

        if(data_passengers.length != total_passengers){
            throw new ResponseError(400, "your not complete input data passengers");
        }

        
        const checked = await prisma.order.findMany({
            where: {
              flight_id,
              passenggers: {
                some: {
                  fullname: {
                    in: data_passengers.map(passenger => passenger.fullname)
                  }
                }
              }
            }
          });

        if(checked.length !==0){
            throw new ResponseError(400, "you has been ordered this flight");
        }
    
        const randomString = crypto.randomBytes(Math.ceil(10 / 2)).toString('hex').slice(0, 10);
        const flight = await prisma.flight.findUnique({where: {id: flight_id}, select: {price: true}});
        
        const today = new Date();
        const threeDaysLater = new Date(today);
        threeDaysLater.setDate(today.getDate() + 3);

        const tax = Math.floor(0.1 * flight.price);
        const total_price = total_passengers * flight.price + tax;
        
        const orders = await prisma.order.create({
            data: {
                user_id : id,
                flight_id,
                payment_type_id : 1,
                booking_code: randomString,
                total_passengers,
                total_price,
                status: "UNPAID",
                exp: threeDaysLater
            }});

        await Promise.all(data_passengers.map(async (value) => {
            await prisma.passenger.create({data: {order_id: orders.id, ...value}});
        }));

        return orders.id;
    }

    static getById = async (request) => {
        const {id} = request;

        if(!id){
            throw new ResponseError(400, "invalid order id");
        }
        
        const orders = await prisma.order.findUnique({
            where: {
                id: +id
            },

            include: {
                flight: {
                    select: {
                    departure_time: true,
                    arrival_time: true,
                    class: true,
                    price: true,
                    free_baggage:true,
                    cabin_baggage:true,
                    flight_date: true,
                    airplane: true,
                    airline: true,
                    from: true,
                    to: true
                    }
                }
            }
        });

        const passengers = await prisma.passenger.findMany({where: {order_id: orders.id}, select:{person:true}});

        let adult = 0;
        let child = 0;

        passengers.forEach((passenger) => {
        if (passenger.person === 'adult') {
            adult++;
        } else if (passenger.person === 'child') {
            child++;
        }
        });
        
        const adult_price = adult * orders.flight.price;
        const child_price = child * orders.flight.price;
        const tax = Math.floor(0.1 * orders.flight.price);
        const total_price = orders.total_passengers * orders.flight.price + tax;

        const result = {
            booking_code: orders.booking_code,
            info_departure_airport: {
                departure_time: orders.flight.departure_time,
                date: orders.flight.flight_date,
                departure_airport: orders.flight.from.name
            },
            info_flight: {
                airline_name: orders.flight.airline.name,
                class: orders.flight.class,
                airplane_code : orders.flight.airplane.airplane_code,
                logo: orders.flight.airline.logo,
                baggage: orders.flight.free_baggage,
                cabin_baggage: orders.flight.cabin_baggage
            },
            info_arrival_airport: {
                arrival_time: orders.flight.arrival_time,
                date: orders.flight.flight_date,
                arrival_airport: orders.flight.to.name
            },
            info_price: {
                adult_total: adult,
                child_total: child,
                adult_price,
                child_price,
                tax,
                total_price
            }
        }

        return {data: result, total_passengers: orders.total_passengers};
    }
}

export default Order;