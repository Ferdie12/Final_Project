const {User} = require('../db/models');
const bcryp = require('bcrypt');
const passport = require('../utils/passport');

module.exports = {
    registerPage: (req, res) => {
        return res.render('auth/register', {errors: {name: '', email: '', phone: '', password: ''}});
    },

    register: async (req, res) => {
        try {
            const {name, email, phone, password} = req.body;

            // validasi
            const error = {errors: {}};
            if (!name) {
                error.errors.name = 'name is required';
            }
            if (!email) {
                error.errors.email = 'email is required';
            }
            if (!phone) {
                error.errors.phone = 'phone is required';
            }
            if (!password) {
                error.errors.password = 'password is required';
            }
            if (!name || !email || !phone || !password) {
                return res.render('auth/register', error);
            }

            const exist = await User.findOne({where: {email}});
            if (exist) {
                error.errors.email = 'email is already used!';
                return res.render('auth/register', error);
            }

            const hashPassword = await bcryp.hash(password, 10);

            await User.create({
                name, email, password: hashPassword
            });

            return res.redirect('/login');
        } catch (error) {
            throw error;
        }
    },

    loginPage: (req, res) => {
        return res.render('auth/login', {errors: {email: '', password: ''}});
    },

    login: passport.authenticate('local', {
        successRedirect: '/whoami',
        failureRedirect: '/login',
        failureFlash: true
    }),

    whoami: async (req, res) => {
        try {
            return res.render('auth/whoami', {user: req.user});
        } catch (error) {
            throw error;
        }
    }
};