 
import { Router } from "express";
import * as authController from './controller/auth.controller.js'
import { asyncHandler } from "../../Services/ErrorHandler.services.js";
import validation from "../../Middleware/validation.middleware.js";
import * as validationSchema from './auth.validation.js'
const router = new Router();//Modular Routing

router.post("/signin", validation(validationSchema.signin)  , authController.signin) ;

router.post("/signup", validation(validationSchema.signup)  , authController.signup) ;

router.get("/confirmEmail/:token", validation(validationSchema.token),  authController.confairmEmails) ;

 router.get("/checkConfirmEmail/:email", validation(validationSchema.checkConfirmEmail),  authController.checkConfirmEmail);

//  router.put("/updateUser")

// forget password
// {
 router.post("/forgotPassword", validation(validationSchema.forgotPassword)  , authController.forgotPassword) ;
router.post("/sendCode", validation(validationSchema.sendCode)  , authController.sendCode) ; 
// }

router.post("/logout", asyncHandler(authController.logout));

router.patch("/changePassword",validation(validationSchema.changePassword) , asyncHandler(authController.changePassword));

export default router
