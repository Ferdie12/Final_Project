import prisma from "../application/database.js";
import ResponseError from "../error/response-error.js";

class Airplane {
    static getAll = async () => {
        const airplanes = await prisma.airplane.findMany({
            orderBy: [
              {id: 'asc'}
            ],
          });
        
        if(!airplanes){
            throw new ResponseError(400, "data airplanes not found");
        }

        return airplanes;
    };

    static getById = async (request) => {
        const airplane_code = request
        const airplanes = await prisma.airplane.findUnique({
            where: {id: +airplane_code},
            include: {
                airline: true
            }
          });

        if(!airplanes){
            throw new ResponseError(400, `cannot get airplane with airplane id not found`);
        }

        return airplanes;
    };
}

export default Airplane;