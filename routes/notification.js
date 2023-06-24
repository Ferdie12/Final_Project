const express = require("express");
const router = express.Router();
const notification = require("../controllers/admin/notification");

router.get('/', notification.getAll);
router.get('/:id_notification', notification.read);

module.exports = router;