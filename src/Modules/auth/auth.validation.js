import joi from "joi";
import { geniralFeild } from "../../Services/geniralFeild.validation.js";


export const signup= joi.object({

userName: geniralFeild.userName ,
   
    email: geniralFeild.email , //    email:joi.string().email().required(),
    password: geniralFeild.password ,
     phone: geniralFeild.phone , 
    role: geniralFeild.role ,
    gender: geniralFeild.gender ,

});


export const token = joi
  .object({
    token: geniralFeild.token
  })
  .required();

  export const checkConfirmEmail = joi
  .object({
    email: geniralFeild.email
  })
  .required();

  export const signin = joi.object({
    email: geniralFeild.email,
    password: geniralFeild.password,
  })
  .required();

  export const sendCode = joi.object({
    email: geniralFeild.email,
  })
  .required();


  export const forgotPassword = joi
  .object({
    email: geniralFeild.email,
    NEWpassword: geniralFeild.password,
    Cpassword: geniralFeild.password.valid(joi.ref("NEWpassword")),
    code: joi.string().required(),
  })
  .required();

  export const changePassword = joi
  .object({
     oldPassword: geniralFeild.password,
    newPassword: geniralFeild.password,
    CnewPassword: geniralFeild.password.valid(joi.ref("newPassword")),
  })
  .required();
  