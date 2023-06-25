const data_airline = require('./airline');
const data_airplane = require('./airplane');
const data_airport = require('./airport');
const data_flight = require('./flight');

function insertData(){
    data_airline();
    data_airplane();
    data_airport();
    data_flight();
}

module.exports = insertData;