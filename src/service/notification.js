import prisma from "../application/database.js";
import ResponseError from "../error/response-error.js";

class notification {
    static getAll = async (id) => {
        const notifications = await prisma.notification.findMany({
            where: {user_id: id},
            orderBy: [
                {
                    id: "desc"
                }
            ],
          });

        return notifications;
    };

    static read = async (request, id) => {
        const notification_id = request;

        const notifications = await prisma.notification.findUnique({where: {id: +notification_id}});
        
        if(!notifications){
            throw new ResponseError(400, `cannot get notification with notification id not found`);
        }

        const check = await prisma.notification.findFirst({where: {user_id: id}});
        
        if(!check){
            throw new ResponseError(400, `cannot get notification with user id not found`);
        }

        const read = await prisma.notification.update({data: {isread: true},where: {id: +notification_id}})

        return read;
    }
};

export default notification;