import joi from 'joi';

export const geniralFeild = {

    userName: joi.string()
    .alphanum()
    .required()
    .max(20)
    .messages({
      "any.required": "Username is required",
      "string.empty": "Username cannot be empty",
      "string.alphanum": "Username must only contain letters and numbers",
      "string.max": "Username must be at most 20 characters long",
    }),

    // email:joi.string().email({minDomainSegments:2,tlds:{allow:['com','net']}}).required()
    email:joi.string().email({minDomainSegments:2,tlds:{allow:['com','net','ps']}}).required(),
   
    password: joi.string()
    .required()
    .messages({
      "any.required": "password is required",
      "string.empty": "password cannot be empty",
    }),

  phone: joi.string()
    .required()
    .messages({
      "any.required": "Phone number is required",
      "string.empty": "Phone number cannot be empty",
    }),

  role: joi.string()
    .required()
    .messages({
      "any.required": "Role is required",
      "string.empty": "Role cannot be empty",
    }),

  gender: joi.string()
    .required()
    .valid("male", "female")
    .messages({
      "any.required": "Gender is required",
      "any.only": "Gender must be either 'male' or 'female'",
      "string.empty": "Gender cannot be empty",
    }),


 
    token: joi.string().required(),
   
   
} 
 
 
 