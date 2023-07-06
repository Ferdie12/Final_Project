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
        const passengerSchema = Joi.object({
            fullname: Joi.string().required(),
            gender: Joi.string().valid('laki-laki', 'perempuan').required(),
            birthday: Joi.string(),
            person: Joi.string().valid('adult', 'child').required(),
            nationality: Joi.string().required(),
            no_ktp: Joi.string().pattern(/^[0-9]{16}$/).required().messages({
                'string.pattern.base': 'Nomor identitas harus terdiri dari 16 angka',
                'any.required': 'Nomor identitas harus diisi'
            })
        });
        
        // Skema validasi menggunakan Joi
        const schema = Joi.object({
            flight_id: Joi.number().integer().required(),
            data_passengers: Joi.array().items(passengerSchema).min(1).required(),
            passengers: Joi.object({
                adult: Joi.number().integer().min(1).required(),
                child: Joi.number().integer().min(0)
            }).required()
        });

        const { error, value } = schema.validate(data);

        return error
    }
}