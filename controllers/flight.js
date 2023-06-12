const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
    show: async (res, next) => {
      try {
          const flight = await prisma.flights.findMany({
              include: {
                from_airport: true,
                airline: true,
                to_airport: true
              },
            })
        return res.status(200).json({
          message: "success",
          data: flight,
        });
      } catch (error) {
        next(error);
      }
    },
  
    create: async (req, res, next) => {
      try {
        const { airline_id, from_airport_id, to_airport_id, date, departure_time, arrival_time, estimation} = req.body;
  
        if (!airline_id || !from_airport_id || !to_airport_id || !date || !departure_time || !arrival_time || !estimation) {
          return res.status(404).json({
            message: "data tidak lengkap",
            data: null,
          });
        }
  
        const flightData = await prisma.flights.create({
          data: {
            date,
            departure_time,
            arrival_time,
            estimation,
            airline: {
              create: {airline_id}
            },
            from_airport: {
                create: {from_airport_id}
            },
            to_airport: {
                create: {to_airport_id}
            },
          },
          include: {
            airline: true,
            from_airport: true,
            to_airport: true // Include all posts in the returned object
          },
        })
        return res.status(200).json({
          message: "success",
          data: flightData,
        });
      } catch (error) {
        next(error);
      }
    },
  
    showOne: async (req, res, next) => {
      try {
          const {id} = req.params;
        const flight = await prisma.flights.findUnique({
          where : {id : id},
          include: {
            airline: true,
            from_airport: true,
            to_airport: true
            },
          })
        return res.status(200).json({
          message: "success",
          data: flight,
        });
      } catch (error) {
        next(error);
      }
    },
  
    update: async (req, res, next) => {
      try {
          const updateData = req.body;
          const {id} = req.params;
  
          const updateflight = await prisma.flights.update({
              where: {
                id: id,
              },
              data: updateData
            })
  
          if (updateflight[0] == 0) {
              return res.status(404).json({
                  status: false,
                  message: `can't find flight with id ${id}!`,
                  data: null
              });
          }
  
          return res.status(201).json({
              status: true,
              message: 'success',
              data: id
          });
      } catch (error) {
          next(error);
      }
  },
  
  destroy: async (req, res, next) => {
      try {
          const {id} = req.params;
          const update = await prisma.flights.update({
              where: {
                id: id,
              },
              data: {
                airline: {
                  deleteMany: {},
                },
                from_airport: {
                  deleteMany: {},
                },
                to_airport: {
                  deleteMany: {},
                },
              },
            })
          const deleteFlight = await prisma.flights.delete({
              where: {
                id: id,
              },
            })
  
          if (!deleteFlight) {
              return res.status(404).json({
                  status: false,
                  message: `can't find flight with id ${id}!`,
                  data: null
              });
          }
  
          return res.status(200).json({
              status: true,
              message: 'success',
              data: null
          });
      } catch (error) {
          next(error);
      }
  }
  }