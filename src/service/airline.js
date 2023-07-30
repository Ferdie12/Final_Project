import prisma from "../application/database.js";
import ResponseError from "../error/response-error.js";

class Airline {
    static getAll = async () => {
        const airlines = await prisma.airline.findMany();
        
        if(!airlines){
            throw new Error("data airline not found");
        }

        return airlines;
    };

    static getById = async (request) => {
        const airline_code = request
        const airlines = await prisma.airline.findUnique({
            where: {id: +airline_code}
          });

        if(!airlines){
            throw new ResponseError(400, `cannot get airline with airline id not found`);
        }

        return airlines;
    };
}

export default Airline;