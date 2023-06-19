const prisma = require('../../prisma/config');
const formatted = require('../../utils/format');

module.exports = {
    show: async (req,res, next) => {
      try {
          const flight = await prisma.flight.findMany();
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
        const {sort_by = "departure_time", sort_type = "asc"} = req.query;
  
        let {departure_airport, arrival_airport, date, seat_type} = req.body;
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
        if(sort_by == "price"){
          sort_by = "price"
        }else if(sort_by == "flight_duration"){
          sort_by = "flight_duration";
        }

        
  
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
  
        const flights = await prisma.flight.findMany({
          where: {
            flight_date: date,
            class: seat_type,
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

        console.log(flights);
  
        const result = flights.map(flight => {
          const prices = formatted.currency(flight.price);
          const duration = formatted.estimation(flight.flight_duration);
  
          return {
            id: flight.id,
            flight_number: flight.airplane.model.split(" ")[1],
            airplane_model: flight.airplane.model.split(" ")[0],
            info: {
              prices,
              seat_type : flight.class,
              baggage: flight.free_baggage,
              cabin_baggage: flight.cabin_baggage,
            },
            airline:{
              name: flight.airline.name,
              code: flight.airline.airline_code,
              logo: flight.airline.logo
            },
            departure_airport: {
              name: flight.from.name,
              city: flight.from.city,
              country: flight.from.country,
              iata: flight.from.airport_code,
            }, 
            arrival_airport: {
              name: flight.to.name,
              city: flight.to.city,
              country: flight.to.country,
              iata: flight.to.airport_code,
            },
            date: flight.flight_date,
            departure_time: flight.departure_time,
            arrival_time: flight.arrival_time,
            duration,
          };
        });
  
        return res.status(200).json({
          status: true,
          message: "success search flight",
          count: result.length,
          data: result
        });
      } catch (error) {
        next(error);
      }
    },
  
    create: async (req, res, next) => {
      try {
        const { airline_id, from_airport_id, to_airport_id, date, departure_time, arrival_time, estimation} = req.body;
  
        if (!airline_id || !from_airport_id || !to_airport_id || !date || !departure_time || !arrival_time || !estimation) {
          return res.status(404).json({
            message: "data tidak lengkap",
            data: null,
          });
        }
  
        const flightData = await prisma.flight.create({
          data: {
            date,
            departure_time,
            arrival_time,
            estimation,
            airline: {
              create: {airline_id}
            },
            from_airport: {
                create: {from_airport_id}
            },
            to_airport: {
                create: {to_airport_id}
            },
          },
          include: {
            airline: true,
            from_airport: true,
            to_airport: true // Include all posts in the returned object
          },
        })
        return res.status(200).json({
          message: "success",
          data: flightData,
        });
      } catch (error) {
        next(error);
      }
    },
  
    showOne: async (req, res, next) => {
      try {
          const {id} = req.params;
        const flight = await prisma.flight.findUnique({
          where : {id : id},
          include: {
            airline: true,
            from_airport: true,
            to_airport: true
            },
          })
        return res.status(200).json({
          message: "success",
          data: flight,
        });
      } catch (error) {
        next(error);
      }
    },
  
    update: async (req, res, next) => {
      try {
          const updateData = req.body;
          const {id} = req.params;
  
          const updateflight = await prisma.flight.update({
              where: {
                id: id,
              },
              data: updateData
            })
  
          if (updateflight[0] == 0) {
              return res.status(404).json({
                  status: false,
                  message: `can't find flight with id ${id}!`,
                  data: null
              });
          }
  
          return res.status(201).json({
              status: true,
              message: 'success',
              data: id
          });
      } catch (error) {
          next(error);
      }
  },
  
  destroy: async (req, res, next) => {
      try {
          const {id} = req.params;
          const update = await prisma.flight.update({
              where: {
                id: id,
              },
              data: {
                airline: {
                  deleteMany: {},
                },
                from_airport: {
                  deleteMany: {},
                },
                to_airport: {
                  deleteMany: {},
                },
              },
            })
          const deleteFlight = await prisma.flights.delete({
              where: {
                id: id,
              },
            })
  
          if (!deleteFlight) {
              return res.status(404).json({
                  status: false,
                  message: `can't find flight with id ${id}!`,
                  data: null
              });
          }
  
          return res.status(200).json({
              status: true,
              message: 'success',
              data: null
          });
      } catch (error) {
          next(error);
      }
  }
}