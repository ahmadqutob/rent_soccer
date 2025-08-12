import { Router } from "express";
import authorization from "../../Middleware/authorization.middleware.js";
import fileUpload from "../../Middleware/multer.middleware.js";
import { fileValidation } from "../../Middleware/multer.middleware.js";
import * as productController from "./Controller/product.controller.js";

const router = new Router();//Modular Routing

// Create product with image upload
router.post("/createProduct", 
    authorization(["admin"]),  
    fileUpload(fileValidation.image).fields([
        {name:'mainImage', maxCount:1},
        {name:'subImage', maxCount:5},
    ]),
    productController.createProduct
);

// Get product details
router.get("/product/:id", productController.getProductDetails);

export default router;