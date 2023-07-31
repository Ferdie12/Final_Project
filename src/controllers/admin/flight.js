import flightService from "../../service/flight.js";

class Flight {
    static getAll = async (req,res, next) => {
      try {
          const result = await flightService.getAll();
          return res.status(200).json({
          message: "success",
          data: result,
          });
      } catch (error) {
        next(error);
      }
    };

    static search = async (req,res, next) => {
      try {
        const result = await flightService.search(req.body, req.query);
  
        return res.status(200).json({
          status: true,
          message: "success search flight",
          adult: result.adult,
          child: result.child,
          count: result.length,
          data: result.data
        });
      } catch (error) {
        next(error);
      }
    };

    static getByIdPrice = async (req, res, next) => {
      try {
        const result = await flightService.getByPrice(req.params, req.query);

        return res.status(200).json({
          status: true,
          message: "success",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
}

export default Flight;