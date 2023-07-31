import notificationService from "../service/notification.js";

class Notification {

    static getAll = async (req,res,next) => {
        try {
            const result = await notificationService.getAll(req.user.id);
    
            return res.status(200).json({
                status : true,
                message: "Get All notifications succes",
                data : result
            })
        } catch (err) {
            next(err);
        }
    };
    
    static read = async (req,res,next) => {
        try {
            const result = await notificationService.read(req.params.id_notification, req.user.id);
            
            return res.status(200).json({
                status : true,
                message: "read notifications succes",
                data : result
            });
    
        } catch (err) {
            next(err)
        }
    }
}

export default Notification;