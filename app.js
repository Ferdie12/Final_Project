require('dotenv').config();
const express = require('express');
const cookie = require('cookie-parser');
const app = express();
const morgan = require('morgan');
const router = require('./routes');
const cors = require('cors');


app.use(cors({
    origin: 'http://localhost:5173', // Atur origin yang diizinkan (contoh: http://localhost:3000)
    credentials: true // Izinkan kredensial (cookie, header, dll.)
  }));
app.use(cookie());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(morgan('dev'));
app.set('view engine', 'ejs');

app.use(router);

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