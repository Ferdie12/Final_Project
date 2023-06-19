const express = require("express");
const router = express.Router();
const notification = require("../controllers/admin/notification");

router.get('/', notification.getAll)
router.get('/:id_notification', notification.getById)
router.post('/', notification.create)
router.put('/:id_notification', notification.update)
router.delete('/:id_notification', notification.destroy)
module.exports = router;