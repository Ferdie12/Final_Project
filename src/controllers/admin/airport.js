import airportService from "../../service/airport.js";
class Airport {

    static getAll = async (req,res,next) => {
        try {
            const result = await airportService.getAll();
    
            return res.status(200).json({
                status : true,
                message: "Get All airports succes",
                data : result
            })
        } catch (err) {
            next(err);
        }
    };
    
    static getById = async (req,res,next) => {
        try {
            const result = await airportService.getById(req.params.code);
    
            return res.status(200).json({
                status : true,
                message: "Get By Id airports succes",
                data : result
            });
    
        } catch (err) {
            next(err)
        }
    }
    
}

export default Airport;