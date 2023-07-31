import nodemailer from "nodemailer";
import oauth from "./oauth.js";
import ejs from "ejs";

const {
    GOOGLE_REFRESH_TOKEN,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_SENDER_MAIL
} = process.env;

oauth.oauth2Client.setCredentials({refresh_token: GOOGLE_REFRESH_TOKEN});

class Nodemailer {
    static sendMail = async (to, subject, html) => {
        const accessToken = await oauth.oauth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: GOOGLE_SENDER_MAIL,
                clientId: GOOGLE_CLIENT_ID,
                clientSecret: GOOGLE_CLIENT_SECRET,
                refreshToken: GOOGLE_REFRESH_TOKEN,
                accessToken: accessToken
            }
        });

        transport.sendMail({from: `Quicktix < ${process.env.USER} >`,to, subject, html});
    };

    static getHtml = (fileName, data) => {
        return new Promise((resolve, reject) => {
            const path = `${process.cwd()}/src/views/${fileName}`;

            ejs.renderFile(path, data, (err, data) => {
                if (err) {
                    return reject(err);
                }
                return resolve(data);
            });
        });
    }
}

export default Nodemailer;