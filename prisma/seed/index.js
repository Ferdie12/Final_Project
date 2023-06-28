const data_airline = require('./airline');
const data_airplane = require('./airplane');
const data_airport = require('./airport');
const data_flight = require('./flight');
const data_payment = require('./payment');

function insertData(){
    data_airline();
    data_airplane();
    data_airport();
    data_payment();
}

module.exports = {insertData, data_flight};