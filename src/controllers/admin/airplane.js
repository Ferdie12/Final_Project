import airplaneService from "../../service/airplane.js";
class Airplane {

    static getAll = async (req,res,next) => {
        try {
            const result = await airplaneService.getAll();
    
            return res.status(200).json({
                status : true,
                message: "Get All airplanes succes",
                data : result
            })
        } catch (err) {
            next(err);
        }
    };
    
    static getById = async (req,res,next) => {
        try {
            const result = await airplaneService.getById(req.params.id_airplane)
        
            return res.status(200).json({
                status : true,
                message: "Get By Id airplanes succes",
                data : result
            });
    
        } catch (err) {
            next(err)
        }
    }
    
}

export default Airplane;