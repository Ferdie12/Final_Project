import validate from "../validation/validation.js";
import {
    loginUserValidation,
    registerUserValidation
} from "../validation/user-validation.js";
import prisma from "../application/database.js";
import ResponseError from "../error/response-error.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";
import nodemailer from "../utils/nodemailer.js";
import imagekit from "../utils/imagekit.js";
import notification from "../utils/notif.js";
const {JWT_SECRET_KEY} = process.env;

class user {
    static register = async (request) => {
        const data = validate(registerUserValidation, request);
        
        if(!data){
        throw new ResponseError(400, "you must input all value");
        }
        
        const {name, email, phone, password, confirmpassword} = data;

        const exist = await prisma.user.findUnique({where: {email}});
        if (exist) {
            throw new ResponseError(400, "email already registered");
        }

        let otp = Math.floor(Math.random() * 900000) + 100000;
        const hashPassword = await bcrypt.hash(password, 10);

        if(data.email == process.env.ADMIN_1 || data.email == process.env.ADMIN_2 ||data.email == process.env.ADMIN_3){
            const admin = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashPassword,
                    phone,
                    otp,
                    user_type: 'basic',
                    role: 'admin',
                    activation: true
                }
            });

            return {
                data: admin.id,
                message: "succes create admin account"
            }
        }
        


        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashPassword,
                phone,
                otp,
                user_type: 'basic',
                role: 'buyer',
                activation: false
            }
        });

        const html = await nodemailer.getHtml('email/activation.ejs', {user: {name: user.name}, otp});
        nodemailer.sendMail(user.email, 'Activation Account', html);

        return {message: "succes create account", data: user.id};
    };

    static login = async (request) => {
        const loginRequest = validate(loginUserValidation, request);

        const {email, password} = loginRequest;

        const user = await prisma.user.findUnique({where: {email}});
        if (!user) {
        throw new ResponseError(404, "email or password is not valid");
        }

        if(!user.activation){
            throw new ResponseError(404, 'your account has not been activated!');
        }


        if (user.user_type == 'google' && !user.password) {
            throw new ResponseError(404, 'your accont is registered with google oauth, you need to login with google');
        }

        const passwordCorrect = await bcrypt.compare(password, user.password);
        if (!passwordCorrect) {
            throw new ResponseError(404, "email or password is not valid");
        }

        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        const token = await jwt.sign(payload, JWT_SECRET_KEY, {expiresIn: "1d"});

        return token;
    };

    static loginGoogle = async(request) => {
        
        const { access_token } = request;

        if (!access_token) {
           throw new ResponseError(400, "acces token is required");
          }
    
          const response = await axios.get(
            `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
          );
          const { name, email } = response.data;

        let user = await prisma.user.findUnique({where: {email: email}});
        if(!user){
            user = await prisma.user.create({
                    data: {
                        name,
                        email,
                        user_type: 'google',
                        role: "buyer",
                        activation: true,
                        otp: 123456
                    }})
        }

        const checkNotif = await prisma.notification.findFirst({where: {user_id: user.id}});
            if(!checkNotif){
                const notifData = {
                    title: "Welcome To Quicktix",
                    description: `your account succes registered in quicktix`,
                    user_id: user.id
                };
    
                notification(notifData);
                const html = await nodemailer.getHtml('email/notification.ejs', {user: {name: user.name, subject: notifData.title, description: notifData.description}});
                nodemailer.sendMail(user.email, 'Welcome To Quicktix', html);
            }

        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        const token = await jwt.sign(payload, JWT_SECRET_KEY);

        return token;
    }

    static activation = async(request) => {
        const {user_id, otp} = request;

        if (!otp) {
            throw new ResponseError(400, 'you must input otp');
        }

        const check = await prisma.user.findUnique({where: {id: user_id}, select: {otp: true}});

        if (!check) {
            throw new ResponseError(400, 'invalid request');
        }

        if(check.otp != otp){
            throw new ResponseError(400, 'you input wrong otp');
        }

        const updated = await prisma.user.update({data:{activation : true},where: {id: user_id}});
        if (!updated) {
            throw new ResponseError(400, 'activation failed');
        }
        
        const checkNotif = await prisma.notification.findFirst({where: {user_id: updated.id}});
        if(!checkNotif){
            const notifData = {
                title: "Welcome To Quicktix",
                description: `your account succes registered in quicktix`,
                user_id: updated.id
            };

            notification(notifData);
            const html = await nodemailer.getHtml('email/notification.ejs', {user: {name: updated.name, subject: notifData.title, description: notifData.description}});
            nodemailer.sendMail(updated.email, 'Welcome To Quicktix', html);
        }

        return 'activation succes, your account succes registered';

    };

    static sendOtp = async(request) => {
        const {user_id} = request;

        let otp = Math.floor(Math.random() * 900000) + 100000;

        const check = await prisma.user.update({data:{otp},where: {id: +user_id}, select:{name:true, email: true}});

        if (!check) {
            throw new ResponseError(400, 'invalid request');
        }

        const html = await nodemailer.getHtml('email/activation.ejs', {user: {name: check.name}, otp});
        nodemailer.sendMail(check.email, 'Activation Account', html);

        return "we send new otp to activation your email";
    };

    static forgotPassword = async (request) => {
        const {email} = request;

        if (!email) {
            throw new ResponseError(400, "you must input email on form");
        }

        const user = await prisma.user.findUnique({where: {email}});
        if (!user) {
            throw new ResponseError(400, "email is not registered");
        }

        const payload = {
            id: user.id
        };

        const token = await jwt.sign(payload, JWT_SECRET_KEY);
        const url = `https://quicktix-pi.vercel.app/reset-password?token=${token}`;
        const html = await nodemailer.getHtml('email/resetpassword.ejs', {name: user.name, url});
        nodemailer.sendMail(user.email, 'Reset password request', html);

        return 'we send an email check your email to change your password!';
    };

    static resetPassword = async(request, token) => {
        const {new_password, confirm_new_password} = request;

        if (!token) {
            throw new ResponseError(400, "credential is not valid");
        }
        if (new_password != confirm_new_password) {
            throw new ResponseError(400, "password and confirm password is not match");
        }

        const hashPassword = await bcryp.hash(new_password, 10);
        const data = await jwt.verify(token, JWT_SECRET_KEY);

        const updated = await prisma.user.update({data: {password: hashPassword}, where: {id: data.id}});
        if (!updated) {
            
        }

        return 'reset password success';

    };

    static getUser = async (request) => {
        const user = await prisma.user.findUnique({
            where: {id: request}, 
            select:{
                name: true,
                email: true,
                phone: true,
                avatar: true
            }
        })

        if(!user){
            throw new ResponseError(400, "user not found");
        };

        return user;
    };

    static updateAvatar = async (request) => {
        const{id} = request;

        if(!id){
            throw new ResponseError(400, "id not found");
        }

        const check = await prisma.user.findUnique({where: {id}});
        if(!check){
            throw new ResponseError(400, "user not found");
        }

        const stringFile = req.file.buffer.toString('base64');

            const uploadFile = await imagekit.upload({
                fileName: req.file.originalname,
                file: stringFile
            });


        const updated = await prisma.user.update({data:{avatar: uploadFile.url}, where: {id: id}});
        if (!updated) {
            throw new ResponseError(400, "updated failed")
        }

        return updated.avatar;
    };

    static updateProfile = async (request, id) => {

        const{name, email, phone}= request;

        if(name || email || phone){

            const checked = await prisma.user.findUnique({where: {id}});

            const nama = name || checked.name;
            const mail = email || checked.email;
            const nomer = phone || checked.phone;

            const updated = await prisma.user.update({data:{name: nama, email: mail, phone:nomer}, where: {id: id}});
            if (!updated) {
                throw new ResponseError(400, "updated failed")
            }

            return 'updated success';
            
        } else {
            throw new ResponseError(400, "must to input one value");
        }
    }

}



export default user;
