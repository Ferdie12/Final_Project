import orderService from "../service/order.js";

class Order {
    static getAll = async (req, res, next) => {
        try {
          const result = await orderService.getAll(req.user.id);
    
          return res.status(200).json({
            status: true,
            message: "Success get all order",
            data: result
          });
        } catch (error) {
          next(error);
        }
      };

    static create = async (req,res,next) => {
        try {
           const result = await orderService.create(req.body, req.user.id);

            return res.status(200).json({
                status: true,
                message: "succes create",
                data : {
                    order_id: result
                }
            }) 
        } catch (error) {
            next(error);
        }
    };

    static getById = async (req,res,next) => {
        try {
            const result = await orderService.getById(req.params);

            return res.status(200).json({
                status: true,
                message: "succes",
                total_passengers: result.total_passengers, 
                data: result.data
            })
        } catch (error) {
            next(error) 
        }
    }
}

export default Order;