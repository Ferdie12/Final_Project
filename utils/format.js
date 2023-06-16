const moment = require('moment');

module.exports = {

    date : (date) =>{
        return moment(date).format('DD-MM-YYYY');
    },

    time : (time) =>{
        return moment(time).format('HH:mm');
    },

    estimation : (estimation) => {
        const parse = estimation.split(":");
        const hour = +parse[0];
        const minute = +parse[1];
      
        const hourString = `${hour} hours`;
        const minuteString = `${minute} minutes`;
      
        return `${hourString} ${minuteString}`;
    },
    
    currency: (number) => new Intl.NumberFormat("id", { style: "currency", currency: "IDR" }).format(number),

    country: (string) => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}

