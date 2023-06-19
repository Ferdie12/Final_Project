const prisma = require('../../prisma/config');
module.exports = {

    getAll : async (req,res) => {
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
            throw err;
        }
    },
    
    getById : async (req,res) => {
        try {
            const airplane_id = req.params.id_airplane
            const airplanes = await prisma.airplane.findUnique({
                where: {id: airplane_id},
                orderBy:{
                    id: "asc"
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
            throw err
        }
    },
    
    create : async (req,res) => {
        try {
            const {airline_id, model, baggage, cabin_baggage} = req.body;
    
            if(!airline_id || !model || !baggage, cabin_baggage){
                return res.status(400).json({
                    status: false,
                    message: "data is required!"
                })
            }

            const airline = await prisma.airline.findUnique({where : {id: airline_id}});
            if(!airline){
                return res.status(400).json({
                    status: false,
                    message: "cannot find airline_id in database"
                })
            }
    
            const exist = await prisma.airplane.findFirst({where: {airline_id, model, baggage, cabin_baggage}});
            if(exist){
                return res.status(400).json({
                    status: false,
                    message: "airplane is already created!"
                })
            }
    
            const airplanes = await prisma.airplane.create({data: req.body});
            
            return res.status(201).json({
                status : true,
                message: "created airplane succes",
                data : airplanes
            })
        } catch (err) {
            throw err;
        }
    },
    
    update : async (req,res) => {
        try {
            const airplane_id = req.params.id_airplane
        
            const update = await prisma.airplane.update({data:req.body, where: {id: airplane_id}});
            
            if(!update){
                return res.status(404).json({
                    status : false,
                    message: `cannot update airplane with airplane id not found`
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
            const airplane_id = req.params.id_airplane
        
            const deleted = await prisma.airplane.delete({where: {id: airplane_id}});
            
            if(!deleted){
                return res.status(404).json({
                    status : false,
                    message: `cannot delete airplane with airplane id not found`,
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