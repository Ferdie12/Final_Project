const prisma = require('../../prisma/config');
module.exports = {

    getAll : async (req,res) => {
        try {
            const airports = await prisma.airport.findMany({
                select: {
                 city: true
                },
                orderBy: [
                  {
                    city: "asc"
                  }
                ],
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
            throw err;
        }
    },
    
    getById : async (req,res) => {
        try {
            const airport_id = req.params.id_airport
            const airports = await prisma.airport.findUnique({
                where: {id: airport_id},
                orderBy:{
                    id: "asc"
                }
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
            throw err
        }
    },
    
    create : async (req,res) => {
        try {
            const {name, city, country, airport_code} = req.body;
    
            if(!name || !city || !country, airport_code){
                return res.status(400).json({
                    status: false,
                    message: "data is required!"
                })
            }

            const exist = await prisma.airport.findFirst({where: {name, city, country, airport_code}});
            if(exist){
                return res.status(400).json({
                    status: false,
                    message: "airport is already created!"
                })
            }
    
            const airports = await prisma.airport.create({data: req.body});
            
            return res.status(201).json({
                status : true,
                message: "created airport succes",
                data : airports
            })
        } catch (err) {
            throw err;
        }
    },
    
    update : async (req,res) => {
        try {
            const airport_id = req.params.id_airport
        
            const update = await prisma.airport.update({data:req.body, where: {id: airport_id}});
            
            if(!update){
                return res.status(404).json({
                    status : false,
                    message: `cannot update airport with airport id not found`
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
            const airport_id = req.params.id_airport
        
            const deleted = await prisma.airport.delete({where: {id: airport_id}});
            
            if(!deleted){
                return res.status(404).json({
                    status : false,
                    message: `cannot delete airport with airport id not found`,
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