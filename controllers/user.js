const prisma = require('../prisma/config');
const nodemailer = require('../utils/nodemailer');
const bcryp = require('bcrypt');
const jwt = require('jsonwebtoken');
const {JWT_SECRET_KEY} = process.env;
const validate = require('../utils/validation');
// const oauth2 = require('../utils/oauth');
const imagekit = require('../utils/imagekit');
const notification = require('../utils/notif');
const axios = require('axios');

module.exports = {
    register: async (req, res) => {
        try {
            const {name, email, password, confirmpassword, phone } = req.body;

            if(!name|| !email|| !password|| !confirmpassword|| !phone){
                return res.status(400).json({
                    status:false,
                    message: "you must input all value"
                })
            }

            console.log(name)

            const error = validate.schemaRegister(req.body);
            console.log(error)

            if(error){
                return res.status(400).json({
                    status: false,
                    message: error.details[0].message
                })
            }

            let otp = Math.floor(Math.random() * 900000) + 100000;
            const hashPassword = await bcryp.hash(password, 10);

            if(email == process.env.ADMIN_1 || email == process.env.ADMIN_2 ||email == process.env.ADMIN_3){
                await prisma.user.create({
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

                return res.status(200).json({
                    status: true,
                    message: "succes create admin account"
                })
            }
            
            if(password != confirmpassword){
                return res.status(400).json({
                    status:false,
                    message: "password is not match"
                })
            }

            const exist = await prisma.user.findUnique({where: {email}});
            if (exist) {
                return res.status(400).json({
                    status: false,
                    message: 'email already registered'
                });
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

            return res.status(201).json({
                status: true,
                message: "we send otp to your email and you must to activation your accout",
                data: user.id
            })

        } catch (error) {
            throw error;
        }
    },

    login: async (req, res) => {
        try {
            const {email, password} = req.body;

            const user = await prisma.user.findUnique({where: {email}});
            if (!user) {
                return res.status(400).json({
                    status: false,
                    message: 'email or password is not valid!',
                });
            }

            if(!user.activation){
                return res.status(400).json({
                    status: false,
                    message: 'your account has not been activated!',
                });
            }


            if (user.user_type == 'google' && !user.password) {
                return res.status(400).json({
                    status: false,
                    message: 'your accont is registered with google oauth, you need to login with google',
                });
            }

            const passwordCorrect = await bcryp.compare(password, user.password);
            if (!passwordCorrect) {
                return res.status(400).json({
                    status: false,
                    message: 'email or password is not valid!',
                });
            }

            const payload = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            };

            const token = await jwt.sign(payload, JWT_SECRET_KEY, {expiresIn: "1d"});

            return res.status(200).json({
                status: true,
                message: 'login success!',
                data: token
            });

        } catch (error) {
            throw error;
        }
    },

    google_login: async (req, res) => {
        try {
            const { access_token } = req.body;

            if (!access_token) {
              return res.status(400).json({ message: "Access Token is required" });
            }
      
            const response = await axios.get(
              `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
            );
            const { name, email } = response.data;

        let user = await prisma.user.findUnique({where: {email: email}});
        if(!user){
            await prisma.user.create({
                data: {
                    name,
                    email,
                    user_type: 'google',
                    role: "buyer",
                    activation: true,
                    otp: 123456
                }})
        }

        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        const token = await jwt.sign(payload, JWT_SECRET_KEY);

        return res.status(200).json({
            status: true,
            message: 'login success!',
            data: token
        });
        } catch (error) {
            throw error
        }
    },

    activation: async (req,res) => {
        try {
            const {user_id, otp} = req.body;
            if (!user_id||!otp) {
                return res.status(403).json({
                    status: false,
                    message: 'you must input iser_id and otp'
                });
            }

            const check = await prisma.user.findUnique({where: {id: user_id}, select: {otp: true}});

            if (!check) {
                return res.status(403).json({
                    status: false,
                    message: 'invalid request'
                });
            }

            if(check.otp != otp){
                return res.status(400).json({
                    message: "you input wrong otp"
                });
            }

            const updated = await prisma.user.update({data:{activation : true},where: {id: user_id}});
            if (!updated) {
                return res.status(403).json({
                    status: false,
                    message: 'activation failed'
                });
            }
            
            const checkNotif = await prisma.notification.findFirst({where: {user_id: updated.id}});
            if(!checkNotif){
                const notifData = {
                    title: "Welcome To Quicktix",
                    description: `your account succes registered in quicktix`,
                    user_id: updated.id
                };
    
                notification.sendNotif(notifData);
                const html = await nodemailer.getHtml('email/notification.ejs', {user: {name: updated.name, subject: notifData.title, description: notifData.description}});
                nodemailer.sendMail(user.email, 'Activation Account', html);
            }

            return res.status(200).json({
                status: true,
                message: 'activation succes, your account succes registered'
            });
        } catch (err) {
            throw err;
        }
    },

    sendOtp: async (req,res) => {
        try {
            const {user_id} = req.query;
            if (!user_id) {
                return res.status(403).json({
                    status: false,
                    message: 'you must insert user_id'
                });
            }

            let otp = Math.floor(Math.random() * 900000) + 100000;

            const check = await prisma.user.update({data:{otp},where: {id: +user_id}, select:{name:true, email: true}});

            if (!check) {
                return res.status(403).json({
                    status: false,
                    message: 'invalid request'
                });
            }

           
            const html = await nodemailer.getHtml('email/activation.ejs', {user: {name: check.name}, otp});
            nodemailer.sendMail(check.email, 'Activation Account', html);
        
            return res.status(200).json({
                status: true,
                message: "we send new otp to activation your email"
            });
        } catch (error) {
            throw error
        }
        
    },

    forgotPassword: async (req, res) =>{
        try {
            const {email} = req.body;

            if (!email) {
                return res.status(400).json({
                    status: false,
                    message: "you must input email on form"
                })
            }

            const user = await prisma.user.findUnique({where: {email}});
            if (!user) {
                return res.status(400).json({
                    status: false,
                    message: "email is not registered"
                })
            }

            const payload = {
                id: user.id
            };

            const token = await jwt.sign(payload, JWT_SECRET_KEY);
            const url = `https://quicktix-pi.vercel.app/reset-password?token=${token}`;
            const html = await nodemailer.getHtml('email/resetpassword.ejs', {name: user.name, url});
            nodemailer.sendMail(user.email, 'Reset password request', html);

            return res.status(200).json({
                status: true,
                message: 'we will send a email if the email is registered!'
            });
        } catch (error) {
            throw error
        }
    },

    resetPassword: async (req,res) => {
        try {
            const {token} = req.query
            const {new_password, confirm_new_password} = req.body;
            if (!token) {
                return res.status(400).json({message: "credential is not valid"});
            }
            if (new_password != confirm_new_password) {
                return res.status(400).json({message: "password and confirm password is not match"});
            }

            const hashPassword = await bcryp.hash(new_password, 10);
            const data = await jwt.verify(token, JWT_SECRET_KEY);

            const updated = await prisma.user.update({data: {password: hashPassword}, where: {id: data.id}});
            if (!updated) {
                return res.status(400).json({message: "fail update new passport"});
            }

            return res.status(200).json({
                status: true,
                message: 'reset password success'
            });
        } catch (err) {
            throw err;
        }
    },

    getUser: async(req,res) => {
        try {
            const user = await prisma.user.findUnique({
                where: {id: req.user.id}, 
                select:{
                    name: true,
                    email: true,
                    phone: true,
                    avatar: true
                }
            })

            if(!user){
                return res.status(400).json({
                    status: false,
                    message: "user_id is not valid"
                })
            };

            return res.status(200).json({
                status: true,
                message: "succes get user",
                data : user
            })

        } catch (error) {
            throw error
        }
    },

    updateAvatar: async (req,res) => {
        try {
            const{id} = req.user;
            const stringFile = req.file.buffer.toString('base64');

                const uploadFile = await imagekit.upload({
                    fileName: req.file.originalname,
                    file: stringFile
                });


            const updated = await prisma.user.update({data:{avatar: uploadFile.url}, where: {id: id}});

            if (!updated) {
                return res.status(404).json({
                    status: false,
                    message: `can't find user with id ${id}!`,
                    data: null
                });
            }

            return res.status(201).json({
                status: true,
                message: 'success',
                data: {
                    url_image:uploadFile.url
                }
            });
        } catch (error) {
            throw error
        }
    },

    updateProfile: async (req,res) => {
        try {
            const{id} = req.user;
            const{name, email, phone}=req.body

            if(name || email || phone){

                const checked = await prisma.user.findUnique({where: {id}});

                const nama = name || checked.name;
                const mail = email || checked.email;
                const nomer = phone || checked.phone;

                const updated = await prisma.user.update({data:{name: nama, email: mail, phone:nomer}, where: {id: id}});
                if (!updated) {
                    return res.status(404).json({
                        status: false,
                        message: `can't find user with id ${id}!`,
                        data: null
                    });
                }
    
                return res.status(201).json({
                    status: true,
                    message: 'updated success',
                });
            } else {
                return res.status(400).json({
                    status: false,
                    message: "must to input one value "
                })
            }
        } catch (error) {
            throw error
        }
    }
};