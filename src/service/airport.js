import prisma from "../application/database.js";
import ResponseError from "../error/response-error.js";

class Airport {
    static getAll = async () => {
        const airports = await prisma.airport.findMany({
            select: {
              city: true,
            },
            orderBy: [
              {
                city: "asc",
              },
            ],
            distinct: ['city']
          });
        
        if(!airports){
            throw new Error("data airport not found");
        }
        
        const result = airports.map(airport => ({
            value: airport.city,
            label: airport.city
        }));

        return result;
    };

    static getById = async (request) => {
        const airport_code = request
        const airports = await prisma.airport.findUnique({
            where: {id: +airport_code}
          });

        if(!airports){
            throw new ResponseError(400, `cannot get airport with airport id not found`);
        }

        return airports;
    };
}

export default Airport;