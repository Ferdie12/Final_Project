import airlineService from "../../service/airline.js";
class Airline {

    static getAll = async (req,res,next) => {
        try {
            const result = await airlineService.getAll();
    
            return res.status(200).json({
                status : true,
                message: "Get All airlines succes",
                data : result
            })
        } catch (err) {
            next(err);
        }
    };
    
    static getById = async (req,res,next) => {
        try {
            const result = await airlineService.getById(req.params.code);
    
            return res.status(200).json({
                status : true,
                message: "Get By Id airlines succes",
                data : result
            });
    
        } catch (err) {
            next(err)
        }
    }
    
}

export default Airline;