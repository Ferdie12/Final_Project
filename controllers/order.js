const prisma = require('../prisma/config');
const crypto = require('crypto');

module.exports = {
    create: async (req,res) => {
        const passengers = req.cookies.passenger;
        const {flight_id, data_passengers} = req.body;
        const total_passengers = passengers.adult + passengers.child;

        if(!flight_id || !data_passengers || !passengers){
            return res.status(400).json({
                status: false,
                message: "input data not valid"
            })
        }

        data_passengers.map(async (passenger) => {
            const {fullname, gender, birthday, nationality, no_ktp} = passenger;

            if ( !fullname || !gender || !birthday ||  !nationality || !no_ktp) {
                return res.status(404).json({
                status: false,
                message: 'you not input valid value',
                data: null
                })
            }
        });
    
        const randomString = crypto.randomBytes(Math.ceil(10 / 2)).toString('hex').slice(0, 10);
        const flight = await prisma.flight.findUnique({where: {id: flight_id}, select: {price: true}});
        
        const total_price = total_passengers * flight.price;
        
        const orders = await prisma.order.create({
            data: {
                user_id : req.user.id,
                flight_id,
                payment_type_id : 1,
                booking_code: randomString,
                total_passengers,
                total_price,
                status: "UNPAID",
                exp: "15"
            }});

        
        await prisma.passenger.createMany({data: data_passengers});
        res.clearCookie("passenger");

        return res.status(200).json({
            status: true,
            message: "succes create",
            data : {
                order_id: orders.id
            }
        })


    },

    getById: async (req,res) => {
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
        const tax = 0.1 * orders.flight.price;
        const total_price = orders.total_passengers * orders.flight.price + tax;

        const airline_class = `${orders.flight.airline.name}-${orders.flight.class}`;

        const result = {
            booking_code: orders.booking_code,
            info_departure_airport: {
                departure_time: orders.flight.departure_time,
                date: orders.flight.flight_date,
                departure_airport: orders.flight.from.name
            },
            info_flight: {
                airline_class,
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


    },

    // getAll: async (req,res) => {
    //     const orders = await prisma.order.findMany({
            
    //     })
    // }
}