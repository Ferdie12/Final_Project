const Joi = require('joi');

module.exports = {
    schemaRegister: (data) => {
        const schema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)[A-Za-z\\d]{8,}$')).required().messages({
                'string.pattern.base': 'password harus berisikan huruf besar, huruf kecil, angka, dan minimal 8 karakter'
            }),
            confirmpassword: Joi.string().valid(Joi.ref('password')).required().messages({
                'any.only': 'Konfirmasi password harus sesuai dengan password',
            }),
            phone: Joi.string().pattern(/^[0-9]{10,}$/).required().messages({
                'string.pattern.base': 'nomer hp setidaknya harus 10 angka'
            })
        });

        const { error, value } = schema.validate(data);

        return error
    },

    schemaPassenger: (data) => {

    }
}