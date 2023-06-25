const prisma = require('../prisma/config');
module.exports = {

    getAll : async (req,res,next) => {
        try {
            const notifications = await prisma.notification.findMany({
                where: {user_id: req.user.id},
                orderBy: [
                    {
                        id: "desc"
                    }
                ],
              });
    
            return res.status(200).json({
                status : true,
                message: "Get All notifications succes",
                data : notifications
            })
        } catch (err) {
            next(err);
        }
    },
    
    read : async (req,res,next) => {
        try {
            const notification_id = req.params.id_notification;

            const notifications = await prisma.notification.findUnique({where: {id: notification_id}});
            
            if(!notifications){
                return res.status(404).json({
                    status : false,
                    message: `cannot get notification with notification id not found`
                });
            }

            const read = await prisma.notification.update({data: {isread: true},where: {id: notification_id, user_id: req.user.id}})
            
            return res.status(200).json({
                status : true,
                message: "read notifications succes",
                data : read
            });
    
        } catch (err) {
            next(err)
        }
    }
}