import moment from "moment";

    const date = (dateString) =>{
        const date = moment(dateString).locale('id');
        return date.format('D MMMM YYYY');
    };

    const estimation = (estimation) => {
        const parse = estimation.split(":");
        const hour = +parse[0];
        const minute = +parse[1];
      
        const hourString = `${hour} h`;
        const minuteString = `${minute} m`;
      
        return `${hourString} ${minuteString}`;
    };
    
    const currency =  (number) => new Intl.NumberFormat("id", { style: "currency", currency: "IDR" }).format(number);

    const city = (string) => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

export default {date, estimation, currency, city};


