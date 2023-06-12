const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  show: async (res, next) => {
    try {
      const airport = await prisma.airport.findMany({
        include: {
          id: true,
          name: true,
          city: true,
          country: true,
          airport_code:true
        },
      })
      return res.status(200).json({
        message: "success",
        data: airport,
      });
    } catch (error) {
      next (error);
    }
  },

  create: async (req, res, next) => {
    try {
      const {id, name, city, country, airport_code} = req.body;

      const airport = await prisma.airport.create({
        data: {
          id,
          name,
          city,
          country,
          airport_code
        },
        include: {
          id: true,
          name: true,
          city: true,
          country: true,
          airport_code:true
        },
      })
      return res.status(200).json({
        message: "success",
        data: airport,
      });
    } catch (error) {
      next (error);
    }
  },

  update: async (req, res, next) => {
    try {
        const updateAirport = req.body;
        const {id} = req.params;

        const updateAirportData = await prisma.airport.update({
            where: {
              id: id,
            },
            data: updateAirport
          })

        if (updateAirportData[0] == 0) {
            return res.status(404).json({
                status: false,
                message: `can't find airport with id ${id}!`,
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
        const update = await prisma.airport.update({
            where: {
              id: id,
            },
            data: {
              name: {
                deleteMany: {},
              },
              city: {
                deleteMany: {},
              },
              country: {
                deleteMany: {},
              },
              airport_code: {
                deleteMany: {},
              },
            },
          })
        const deleteAirport = await prisma.airport.delete({
            where: {
              id: id,
            },
          })

        if (!deleteAirport) {
            return res.status(404).json({
                status: false,
                message: `can't find airport with id ${id}!`,
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
};