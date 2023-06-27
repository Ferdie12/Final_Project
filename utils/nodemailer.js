const nodemailer = require("nodemailer");
const {oauth2Client} = require("./oauth");
const ejs = require('ejs');

const {
    GOOGLE_REFRESH_TOKEN,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_SENDER_MAIL
} = process.env;

oauth2Client.setCredentials({refresh_token: GOOGLE_REFRESH_TOKEN});

module.exports = {
    sendMail: async (to, subject, html) => {
        const accessToken = await oauth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: GOOGLE_SENDER_MAIL,
                clientId: GOOGLE_CLIENT_ID,
                clientSecret: GOOGLE_CLIENT_SECRET,
                refreshToken: GOOGLE_REFRESH_TOKEN,
                accessToken: accessToken
            },
            tls: {
                rejectUnauthorized: false
            },
            requireTLS: true
        });

        transport.sendMail({from: `Ferdie Maulana < ${process.env.USER} >`,to, subject, html});
    },

    getHtml: (fileName, data) => {
        return new Promise((resolve, reject) => {
            const path = `${process.cwd()}/views/${fileName}`;

            ejs.renderFile(path, data, (err, data) => {
                if (err) {
                    return reject(err);
                }
                return resolve(data);
            });
        });
    }
}
