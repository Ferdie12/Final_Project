const prisma = require('../prisma/config');
module.exports = {

    getAll : async (req,res) => {
        try {
            const airlines = await prisma.airline.findMany({
                orderBy: {
                  id: 'asc'
                },
              });
    
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
            const airline_id = req.params.id_airline
            const airlines = await prisma.airline.findUnique({
                where: {id: airline_id},
                orderBy:{
                    id: "asc"
                }
              });
    
            if(!airlines){
                return res.status(404).json({
                    status : false,
                    message: `cannot get airline with airline id not found`
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
    },
    
    create : async (req,res) => {
        try {
            const {name, airline_code, logo} = req.body;
    
            if(!name || !airline_code || !logo){
                return res.status(400).json({
                    status: false,
                    message: "name, airline_code, or logo is required!"
                })
            }
    
            const exist = await prisma.airline.findFirst({where: {name, airline_code, logo}});
            if(exist){
                return res.status(400).json({
                    status: false,
                    message: "airline is already created!"
                })
            }
    
            const airlines = await prisma.airline.create({data: req.body});
            
            return res.status(201).json({
                status : true,
                message: "created airline succes",
                data : airlines
            })
        } catch (err) {
            throw err;
        }
    },
    
    update : async (req,res) => {
        try {
            const airline_id = req.params.id_airline
        
            const update = await prisma.airline.update({data:req.body, where: {id: airline_id}});
            
            if(!update){
                return res.status(404).json({
                    status : false,
                    message: `cannot update airline with airline id not found`
                });
            }
            return res.status(200).json({
                status : true,
                message: "updated succes"
            });
        } catch (err) {
            throw err
        }
    },
    
    destroy : async (req,res) => {
        try {
            const airline_id = req.params.id_airline
        
            const deleted = await prisma.airline.delete({where: {id: airline_id}});
            
            if(!deleted){
                return res.status(404).json({
                    status : false,
                    message: `cannot delete airline with airline id not found`,
                });
            }
            return res.status(200).json({
                status : true,
                message: "deleted succes",
            });
        } catch (err) {
            throw err
        }
    }
    
}