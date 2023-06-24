const prisma = require('../../prisma/config');
module.exports = {

    getAll : async (req,res) => {
        try {
            const airlines = await prisma.airline.findMany();
    
            return res.status(200).json({
                status : true,
                message: "Get All airlines succes",
                data : airlines
            })
        } catch (err) {
            throw err;
        }
    },
    
    getById : async (req,res) => {
        try {
            const airline_code = req.params.code
            const airlines = await prisma.airline.findUnique({
                where: {airline_code},
                include: {
                    airplane: true
                }
              });
    
            if(!airlines){
                return res.status(404).json({
                    status : false,
                    message: `cannot get airline with airline_code not found`
                });
            }
    
            return res.status(200).json({
                status : true,
                message: "Get By Id airlines succes",
                data : airlines
            });
    
        } catch (err) {
            throw err
        }
    }
}