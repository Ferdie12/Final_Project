const prisma = require("../prisma/config");

module.exports = {
	sendNotif: async (notification) => {
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
			throw err;
		}
	}
};