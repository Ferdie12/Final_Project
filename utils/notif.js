const prisma = require("../prisma/config");

module.exports = {
	sendNotif: (notification) => {
		try {
			notification.forEach(async notif => {
				await prisma.notification.create({
                    data: {
                        user_id: notif.user_id,
                        title: notif.tile,
                        description: notif.description,
                        isread: false
                    }
				});
			});
		} catch (err) {
			throw err;
		}
	}
};