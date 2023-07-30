import data_airline from './airline.js';
import data_airplane from './airplane.js';
import data_airport from './airport.js';
import data_payment from './payment.js';

function insertData(){
    data_airline();
    data_airplane();
    data_airport();
    data_payment();
}

export default insertData;