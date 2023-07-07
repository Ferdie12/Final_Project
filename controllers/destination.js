const prisma = require('../prisma/config');

module.exports = {

    getDestination : async (req,res) => {
        try {

            const orders = await prisma.$queryRaw`
            SELECT flight.*, departure.city AS departure_city, arrival.city AS arrival_city, COUNT(*) AS count
            FROM orders
            INNER JOIN flight ON orders.flight_id = flight.id
            INNER JOIN airport AS departure ON flight.departure_airport = departure.airport_code
            INNER JOIN airport AS arrival ON flight.arrival_airport = arrival.airport_code
            GROUP BY flight.id, departure.city, arrival.city
            ORDER BY count DESC
            LIMIT 6
             `;

            const destinations = orders.map((order) => {
                return {
                id: order.id,                    
                data: {
                    departure: order.departure_city,
                    arrival: order.arrival_city,
                    price: order.price,
                },
                form: {
                    departure_airport: order.departure_city,
                    arrival_airport: order.arrival_city,
                    date: order.flight_date,
                    seat_type: order.class,
                    adult: 1,
                    child: 0
                },
                };
            });

            return res.status(200).json({
                status: true,
                message: "succes get Destination",
                data: destinations
            })
            
        } catch (error) {
            throw error
        }
    }

}