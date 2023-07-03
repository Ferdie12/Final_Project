const moment = require('moment');

module.exports = {

    date : (dateString) =>{
        const date = moment(dateString).locale('id');
        return date.format('D MMMM YYYY');
    },

    estimation : (estimation) => {
        const parse = estimation.split(":");
        const hour = +parse[0];
        const minute = +parse[1];
      
        const hourString = `${hour} h`;
        const minuteString = `${minute} m`;
      
        return `${hourString} ${minuteString}`;
    },
    
    currency: (number) => new Intl.NumberFormat("id", { style: "currency", currency: "IDR" }).format(number),

    city: (string) => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}

