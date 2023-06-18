const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
    show: async (req, res) => {
        try {
            const payment = await prisma.payment.findMany({
                    include: {
                    order: true,
                    },
            })
            return res.status(200).json({
                message: "success",
                data: payment,
            });

        } catch (error) {
            throw error;
        }
    },

    create: async (req, res) => {
        try {
            const {name, order} = req.body;

            if(!name|| !order){
                return res.status(400).json({
                    status: false,
                    message: "name, or order type is required!"
                })
            }

            const payment = await prisma.payment.create({data: req.body});
            
            return res.status(201).json({
                status : true,
                message: "created payment type",
                data : payment
            })

        } catch (error) {
            throw error;
        }
    }
}