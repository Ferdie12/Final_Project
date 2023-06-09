const prisma = require('../../prisma/config');
module.exports = {

    getAll : async (req,res,next) => {
        try {
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
            
            const result = airports.map(airport => ({
                value: airport.city,
                label: airport.city
            }));
    
            return res.status(200).json({
                status : true,
                message: "Get All airports succes",
                data : result
            })
        } catch (err) {
            next(err);
        }
    },
    
    getById : async (req,res,next) => {
        try {
            const airport_code = req.params.code
            const airports = await prisma.airport.findUnique({
                where: {airport_code}
              });
    
            if(!airports){
                return res.status(404).json({
                    status : false,
                    message: `cannot get airport with airport id not found`
                });
            }
    
            return res.status(200).json({
                status : true,
                message: "Get By Id airports succes",
                data : airports
            });
    
        } catch (err) {
            next(err)
        }
    }
    
}