const prisma = require('../prisma/config');
module.exports = {

    getAll : async (req,res) => {
        try {
            const notifications = await prisma.notification.findMany({
                orderBy: {
                  id: 'asc'
                },
              });
    
            return res.status(200).json({
                status : true,
                message: "Get All notifications succes",
                data : notifications
            })
        } catch (err) {
            throw err;
        }
    },
    
    getById : async (req,res) => {
        try {
            const notification_id = req.params.id_notification
            const notifications = await prisma.notification.findUnique({
                where: {id: notification_id},
                orderBy:{
                    id: "asc"
                }
              });
    
            if(!notifications){
                return res.status(404).json({
                    status : false,
                    message: `cannot get notification with notification id not found`
                });
            }
    
            return res.status(200).json({
                status : true,
                message: "Get By Id notifications succes",
                data : notifications
            });
    
        } catch (err) {
            throw err
        }
    },
    
    create : async (req,res) => {
        try {
            const {user_id, header, description} = req.body;
    
            if(!user_id || !header || !description){
                return res.status(400).json({
                    status: false,
                    message: "user_Id, header, or description is required!"
                })
            }

            const user = await prisma.user.findUnique({where : {id: user_id}});
            if(!user){
                return res.status(400).json({
                    status: false,
                    message: "cannot find user_id in database"
                })
            }
    
            const exist = await prisma.notification.findFirst({where: {user_id, header, description}});
            if(exist){
                return res.status(400).json({
                    status: false,
                    message: "notification is already created!"
                })
            }
    
            const notifications = await prisma.notification.create({
                data: {
                    user_id,
                    header,
                    description,
                    is_read: false
                }
            });
            
            return res.status(201).json({
                status : true,
                message: "created notification succes",
                data : notifications
            })
        } catch (err) {
            throw err;
        }
    },
    
    update : async (req,res) => {
        try {
            const notification_id = req.params.id_notification
        
            const update = await prisma.notification.update({data:req.body, where: {id: notification_id}});
            
            if(!update){
                return res.status(404).json({
                    status : false,
                    message: `cannot update notification with notification id not found`
                });
            }
            return res.status(200).json({
                status : true,
                message: "updated succes"
            });
        } catch (err) {
            throw err
        }
    },
    
    destroy : async (req,res) => {
        try {
            const notification_id = req.params.id_notification
        
            const deleted = await prisma.notification.delete({where: {id: notification_id}});
            
            if(!deleted){
                return res.status(404).json({
                    status : false,
                    message: `cannot delete notification with notification id not found`,
                });
            }
            return res.status(200).json({
                status : true,
                message: "deleted succes",
            });
        } catch (err) {
            throw err
        }
    }
    
}