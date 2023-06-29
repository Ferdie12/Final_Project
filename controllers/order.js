const prisma = require('../prisma/config');
const crypto = require('crypto');

module.exports = {
    getAll: async (req,res,next) => {
        try {
            const orders = await prisma.order.findMany({
                where: {user_id: req.user.id},
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
                }
            });

            const result = await Promise.all(orders.map(async (order) => {
                const passengers = await prisma.passenger.findMany({where: {order_id: order.id}, select:{person:true, fullname:true}});

            let adult = 0;
            let child = 0;
            const penumpang = passengers.map((passenger) => {
                const passengerName = passenger.person === 'adult' ? passenger.fullname : passenger.fullname;
                
                if (passenger.person === 'adult') {
                adult++;
                return {
                    [`penumpang_dewasa_${adult}`]: passengerName
                };
                } else {
                child++;
                return {
                    [`penumpang_anak_${child}`]: passengerName
                };
                }
            });

            const mergedPenumpang = Object.assign({}, ...penumpang);
            const adult_price = adult * order.flight.price;
            const child_price = child * order.flight.price;
            const tax = 0.1 * order.flight.price;
            const total_price = order.total_passengers * order.flight.price + tax;

            console.log(mergedPenumpang);

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
                    airplane_code : order.flight.airplane.airplane_code,
                    logo: order.flight.airline.logo,
                    ...mergedPenumpang
                },
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
            }
            }));

            return res.status(200).json({
                status: true,
                message: "succes get all order",
                data : result
            })
        } catch (error) {
            next(error)
        }
    },

    create: async (req,res,next) => {
        try {
            const {flight_id, data_passengers, passengers} = req.body;
            const {adult, child=0} = passengers
            const total_passengers = adult + child;

            if(!flight_id || !data_passengers || !passengers){
                return res.status(400).json({
                    status: false,
                    message: "input data not valid"
                })
            }

            if(data_passengers.length != total_passengers){
                return res.status(400).json({
                    status: false,
                    message: "your not complete input data passengers"
                })
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
                return res.status(400).json({
                    status: false,
                    message: "you has been ordered this flight"
                })
            }

            data_passengers.map(async (passenger) => {
                const {fullname, gender, birthday, person, nationality} = passenger;

                if ( !fullname || !gender || !birthday ||  !nationality ||!person) {
                    return res.status(404).json({
                    status: false,
                    message: 'you not input valid value',
                    data: null
                    })
                }
            });
        
            const randomString = crypto.randomBytes(Math.ceil(10 / 2)).toString('hex').slice(0, 10);
            const flight = await prisma.flight.findUnique({where: {id: flight_id}, select: {price: true}});
            
            const today = new Date();
            const threeDaysLater = new Date(today);
            threeDaysLater.setDate(today.getDate() + 3);

            const tax = Math.floor(0.1 * flight.price);
            const total_price = total_passengers * flight.price + tax;
            
            const orders = await prisma.order.create({
                data: {
                    user_id : req.user.id,
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

            return res.status(200).json({
                status: true,
                message: "succes create",
                data : {
                    order_id: orders.id
                }
            }) 
        } catch (error) {
            next(error);
        }
    },

    getById: async (req,res,next) => {
        try {

            const {id} = req.params;

            if(!id){
                return res.status(400).json({
                    status: false,
                    message: "invalid orders"
                })
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

            return res.status(200).json({
                status: true,
                message: "succes",
                total_passengers: orders.total_passengers, 
                data: result
            })
        } catch (error) {
            next(error) 
        }
    }
}