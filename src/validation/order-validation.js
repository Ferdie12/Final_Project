import Joi from "joi";

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
const passengerValidation = Joi.object({
    flight_id: Joi.number().integer().required(),
    data_passengers: Joi.array().items(passengerSchema).min(1).required(),
    passengers: Joi.object({
        adult: Joi.number().integer(),
        child: Joi.number().integer()
    }).required()
});

export default passengerValidation;