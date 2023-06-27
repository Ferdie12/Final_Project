const prisma = require('../../prisma/config');
module.exports = {

    getAll : async (req,res,next) => {
        try {
            const airplanes = await prisma.airplane.findMany({
                orderBy: {
                  id: 'asc'
                },
              });
    
            return res.status(200).json({
                status : true,
                message: "Get All airplanes succes",
                data : airplanes
            })
        } catch (err) {
            next(err);
        }
    },
    
    getById : async (req,res,next) => {
        try {
            const airplane_id = req.params.id_airplane
            const airplanes = await prisma.airplane.findUnique({
                where: {id: +airplane_id},
                include: {
                    airline: true
                }
              });
    
            if(!airplanes){
                return res.status(404).json({
                    status : false,
                    message: `cannot get airplane with airplane id not found`
                });
            }
    
            return res.status(200).json({
                status : true,
                message: "Get By Id airplanes succes",
                data : airplanes
            });
    
        } catch (err) {
            next(err)
        }
    }
    
}