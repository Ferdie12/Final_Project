import prisma from "../application/database.js";
import formatted from "../utils/format.js";
import ResponseError from "../error/response-error.js";

class Flight {
    static getAll = async () => {
        const flight = await prisma.flight.findMany({orderBy: [{id:"asc"}]});
        if(!flight){
            throw new Error("data flight errors");
        }
        return flight;
    }
    static search = async (request, query) => {
        let {sort_by = "departure_time", sort_type = "asc"} = query;
  
        let {departure_airport, arrival_airport, date, seat_type, adult=0, child=0, baby=0} = request;
        if(!departure_airport || !arrival_airport || !date || !seat_type) {
          throw new ResponseError(400, "your not input value on filter");
        };
        
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
            throw new ResponseError(400, "departure airport not found");
        }
  
        const arrivalAirport = await prisma.airport.findFirst({
          where: {city: arrival_airport},
          select: {
            airport_code: true
          }
        });

        if(!arrivalAirport) {
            throw new ResponseError(400, "arrival airport not found");
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
            },
            class: seat_type
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
        });

        return {length: result.length, data: result, adult, child};
    };

    
    static getByPrice = async (params, query) => {
        const {id} = params;
        const {adult, child=0} = query;
        const total_passengers = +adult + +child;

        if(!id){
            throw new ResponseError(400, "invalid id");
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

        const adult_price = +adult * flight.price;
        const child_price = +child * flight.price;
        const tax = Math.floor(0.1 * flight.price);
        const total_price = total_passengers * flight.price + tax;

        const result = {
          departure_airport: {
              departure_time: flight.departure_time,
              date: flight.flight_date,
              departure_airport: flight.from.name
          },
          flight: {
              airline_name: flight.airline.name,
              airline_class: flight.class,
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
            adult_total: +adult,
            child_total: +child,
            adult_price,
            child_price,
            tax,
            total_price
        }
        };

        return result;
    }
}

export default Flight;