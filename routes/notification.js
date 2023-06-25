const express = require("express");
const router = express.Router();
const notification = require("../controllers/notification");
const middleware = require("../middleware/auth.js");

router.get('/', middleware.auth,notification.getAll);
router.get('/:id_notification', middleware.auth,notification.read);

module.exports = router;