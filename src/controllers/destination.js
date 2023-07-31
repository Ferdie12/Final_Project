import getDestination from "../service/destination.js";

class Destination {
    static getDestination = async (req,res) => {
        try {
           const result = await getDestination();

            return res.status(200).json({
                status: true,
                message: "succes get Destination",
                data: result
            })
            
        } catch (error) {
            throw error
        }
    }

}

export default Destination;