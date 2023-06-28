require('dotenv').config();
const express = require('express');
const cookie = require('cookie-parser');
const app = express();
const morgan = require('morgan');
const router = require('./routes');
const cors = require('cors');
const ui = require("swagger-ui-express");
const yaml = require("yaml");
const fs = require("fs");

const file = fs.readFileSync('./QuicktixApi.yaml', 'utf-8');
const fileku = yaml.parse(file);

app.use(cors());
app.use(cookie());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(morgan('dev'));
app.set('view engine', 'ejs');

app.use(router);
app.use('/api-docs', ui.serve, ui.setup(fileku))

// 404 middleware
app.use((req,res,next) => {
    try {
        return res.status(404).json({
            status: false,
            message: "salah link uyy"
        });
    } catch (error) {
        next(err);
    }
})

// 500 middleware
app.use((err, req, res, next) => {
    console.log(err);
    return res.status(500).json({
        status: false,
        message: err.message,
        data: null
    });
});

module.exports = app;