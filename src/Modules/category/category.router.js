// import { Router } from "express";
// import authorization from "../../Middleware/authorization.middleware.js";
// import fileUpload from "../../Middleware/multer.middleware.js";
// import { fileValidation } from "../../Middleware/multer.middleware.js";
// import * as categoryController from "./controller/category.controller.js";
// import validation from "../../Middleware/validation.middleware.js";
// import * as validationSchema from './category.validation.js'

// const router = new Router();//Modular Routing

// // Create category with image upload
// router.post("/createCategory", 
//     authorization(["admin"]),   validation(validationSchema.categoryValidation),
//     fileUpload(fileValidation.image).fields([
//         { name: 'image', maxCount: 1 }
//     ]),
//     categoryController.createCategory
// );

// export default router;
