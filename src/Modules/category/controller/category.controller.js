// import { asyncHandler } from "../../../Services/ErrorHandler.services.js";
// import cloudinary from "../../../config/cloudinary.config.js";
// import categoryModel from "../../../../database/Models/category.model.js";

// export const createCategory = asyncHandler(async (req, res, next) => {
//     // Get the uploaded file
//     const { image } = req.files || {};
    
//     // Get category data from request body
//     const { name } = req.body;
    
//     if (!name) {
//         return next(new Error("Category name is required", { cause: 400 }));
//     }
    
//     // Create slug from name
//      // Upload image to Cloudinary
//     if (image && image[0]) {
//         const imageResult = await cloudinary.uploader.upload(image[0].path, {
//             folder: "categories"
//         });
        
//         // Create category with image
//         const category = await categoryModel.create({
//             name,
//             slug,
//             image: {
//                 url: imageResult.secure_url,
//                 public_id: imageResult.public_id
//             }
//         });

//         return res.status(201).json({
//             success: true,
//             message: "Category created successfully",
//             data: category
//         });
//     }

//     return next(new Error("Category image is required", { cause: 400 }));
// });
