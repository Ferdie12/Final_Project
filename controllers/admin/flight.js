const prisma = require('../../prisma/config');
const formatted = require('../../utils/format');

module.exports = {
    getAll: async (req,res, next) => {
      try {
          const flight = await prisma.flight.findMany({orderBy: [{id:"asc"}]});
          return res.status(200).json({
          message: "success",
          data: flight,
        });
      } catch (error) {
        next(error);
      }
    },

    search: async (req,res, next) => {
      try {
        let {sort_by = "departure_time", sort_type = "asc"} = req.query;
  
        let {departure_airport, arrival_airport, date, seat_type, adult, child=0, baby=0} = req.body;
        if(!departure_airport || !arrival_airport || !date || !seat_type) {
          return res.status(400).json({
            status: false,
            message: "your not input value on filter",
            data: null
          });
        };
        
        departure_airport = formatted.city(departure_airport);
        arrival_airport = formatted.city(arrival_airport);
        seat_type = seat_type.toUpperCase();
  
  
        let sorting = [{[sort_by] : sort_type}];

        sort_by = sort_by == "price" || sort_by == "flight_duration" || sort_by == "arrival_time"
  
        const departureAirport = await prisma.airport.findFirst({
          where: {city: departure_airport},
          select: {
            airport_code: true
          }
        });

        if(!departureAirport) {
          return res.status(400).json({
            status: false,
            message: "departure airport not found",
            data: null
          });
        }
  
        const arrivalAirport = await prisma.airport.findFirst({
          where: {city: arrival_airport},
          select: {
            airport_code: true
          }
        });

        if(!arrivalAirport) {
          return res.status(400).json({
            status: false,
            message: "departure airport not found",
            data: null
          });
        }

        console.log([departureAirport, arrivalAirport]);
  
        const flights = await prisma.flight.findMany({
          where: {
            flight_date: date,
            from: {
              city: departure_airport
            },
            to: {
              city: arrival_airport
            }
          },
          include: {
            airplane: true,
            airline: true,
            from: true,
            to: true
          },
          orderBy: sorting
        });
  
        const result = flights.map(flight => {
          const duration = formatted.estimation(flight.flight_duration);

          return {
            id: flight.id,
            logo: flight.airline.logo,
            airline: flight.airline.name,
            class: flight.class,
            departure_time: flight.departure_time,
            arrival_time: flight.arrival_time,
            departure_city: flight.from.city,
            arrival_city: flight.to.city,
            duration,
            price: flight.price,
            departure_airport: {
              departure_time: flight.departure_time,
              date: formatted.date(flight.flight_date),
              departure_airport: flight.from.name
            },
            info_flight: {
                logo: flight.airline.logo,
                airline: flight.airline.name,
                class: flight.class,
                airplane_code : flight.airplane.airplane_code,
                logo: flight.airline.logo,
                baggage: flight.free_baggage,
                cabin_baggage: flight.cabin_baggage
            },
            arrival_airport: {
                arrival_time: flight.arrival_time,
                date: formatted.date(flight.flight_date),
                arrival_airport: flight.to.name
            },
          };
        });S
  
        return res.status(200).json({
          status: true,
          message: "success search flight",
          adult,
          child,
          count: result.length,
          data: result
        });
      } catch (error) {
        next(error);
      }
    },
  
    getById: async (req, res, next) => {
      try {
          const {id} = req.params;

          if(!id){
            return res.status(400).json({
              status: false,
              message: "invalid id"
            })
          }

          const flight = await prisma.flight.findUnique({
          where : {id : +id},
          include: {
            airplane:true,
            airline: true,
            from: true,
            to: true
            },
          })

          const result = {
            departure_airport: {
                departure_time: flight.departure_time,
                date: flight.flight_date,
                departure_airport: flight.from.name
            },
            flight: {
                airline_class,
                airplane_code : flight.airplane.airplane_code,
                logo: flight.airline.logo,
                baggage: flight.free_baggage,
                cabin_baggage: flight.cabin_baggage
            },
            arrival_airport: {
                arrival_time: flight.arrival_time,
                date: flight.flight_date,
                arrival_airport: flight.to.name
            }
          }

        return res.status(200).json({
          status: true,
          message: "success",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },

    getByIdPrice: async (req, res, next) => {
      try {
          const {id, adult, child=0} = req.body;
          const total_passengers = adult + child;

          if(!id){
            return res.status(400).json({
              status: false,
              message: "invalid id"
            })
          }

          const flight = await prisma.flight.findUnique({
          where : {id : +id},
          include: {
            airplane:true,
            airline: true,
            from: true,
            to: true
            },
          })

          const adult_price = adult * flight.price;
          const child_price = child * flight.price;
          const tax = 0.1 * flight.price;
          const total_price = total_passengers * flight.price + tax;

          const result = {
            departure_airport: {
                departure_time: flight.departure_time,
                date: flight.flight_date,
                departure_airport: flight.from.name
            },
            flight: {
                airline_class,
                airplane_code : flight.airplane.airplane_code,
                logo: flight.airline.logo,
                baggage: flight.free_baggage,
                cabin_baggage: flight.cabin_baggage
            },
            arrival_airport: {
                arrival_time: flight.arrival_time,
                date: flight.flight_date,
                arrival_airport: flight.to.name
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
          message: "success",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
}