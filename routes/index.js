const express = require('express');
const user = require('./user');
const router = express.Router();

router.use(user);

router.get('/', (req,res) => {
    return res.status(200).json({
        status: true,
        message: "welcome to api quick tix application in develop"
    })
});


module.exports = router;