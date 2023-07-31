import PaymentService from "../service/payment.js";

class Payment {
    static checkout = async (req,res,next) => {
        try {
            const result = await PaymentService.checkout(req.body, req.user);
            
            return res.status(200).json({
                status:true,
                message: "succes payment",
                data: result
            })


        } catch (error) {
            next(error)
        }
    };

    static getAll = async(req,res,next) =>{
        try {
            const result = await PaymentService.getAll();

            return res.status(200).json({
                status: true,
                message: "succes getAll Payment",
                data: result
            })
        } catch (error) {
            next(error)
        }
    };

    static invoice = async (req, res, next) => {
        try {
          const result = await PaymentService.invoice(req.body, req.user.id);
      
          return res.status(200).json({
            status: true,
            message: "Success get invoice",
            data: result,
          });
        } catch (error) {
          next(error);
        }
    };
      
}

export default Payment;