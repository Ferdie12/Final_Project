import Joi from "joi";

const registerUserValidation = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string(),
    password: Joi.string().pattern(new RegExp('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)[A-Za-z\\d]{8,}$')).required().messages({
        'string.pattern.base': 'password harus berisikan huruf besar, huruf kecil, angka, dan minimal 8 karakter'
    }),
    confirmpassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Konfirmasi password harus sesuai dengan password',
    })
});

const loginUserValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

export {
    registerUserValidation,
    loginUserValidation
}
