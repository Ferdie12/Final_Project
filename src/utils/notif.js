import prisma from "../application/database.js";
import ResponseError from "../error/response-error.js";

const sendNotif = async (notification) => {
		try {
			await prisma.notification.create({
                data: {
                    user_id: notification.user_id,
                    title: notification.title,
                    description: notification.description,
                    isread: false
                }
			});
		} catch (err) {
			throw new ResponseError(400, "message notif failed");
		}
	};

export default sendNotif;