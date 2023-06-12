const prisma = require('../prisma/config');
module.exports = {

    getAll : async (req,res) => {
        try {
            const prices = await prisma.price.findMany({
                orderBy: {
                  id: 'asc'
                },
              });
    
            return res.status(200).json({
                status : true,
                message: "Get All prices succes",
                data : prices
            })
        } catch (err) {
            throw err;
        }
    },
    
    getById : async (req,res) => {
        try {
            const price_id = req.params.id_price
            const prices = await prisma.price.findFirst({
                where: {id: price_id},
                orderBy:{
                    id: "asc"
                }
              });
    
            if(!prices){
                return res.status(404).json({
                    status : false,
                    message: `cannot get price with price id not found`
                });
            }
    
            return res.status(200).json({
                status : true,
                message: "Get By Id prices succes",
                data : prices
            });
    
        } catch (err) {
            throw err
        }
    },
    
    create : async (req,res) => {
        try {
            const {flight_id, seat_type, price} = req.body;
    
            if(!flight_id || !seat_type || !price){
                return res.status(400).json({
                    status: false,
                    message: "flight_Id, description, or price is required!"
                })
            }

            const flight = await prisma.flight.findUnique({where : {id: flight_id}});
            if(!flight){
                return res.status(400).json({
                    status: false,
                    message: "cannot find flight_id in database"
                })
            }
    
            const exist = await prisma.price.findFirst({where: {flight_id, seat_type, price}});
            if(exist){
                return res.status(400).json({
                    status: false,
                    message: "price is already created!"
                })
            }
    
            const prices = await prisma.price.create({data: req.body});
            
            return res.status(201).json({
                status : true,
                message: "created price succes",
                data : prices
            })
        } catch (err) {
            throw err;
        }
    },
    
    update : async (req,res) => {
        try {
            const price_id = req.params.id_price
        
            const update = await prisma.price.update({data:req.body, where: {id: price_id}});
            
            if(!update){
                return res.status(404).json({
                    status : false,
                    message: `cannot update price with price id not found`
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
            const price_id = req.params.id_price
        
            const deleted = await prisma.price.delete({where: {id: price_id}});
            
            if(!deleted){
                return res.status(404).json({
                    status : false,
                    message: `cannot delete price with price id not found`,
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