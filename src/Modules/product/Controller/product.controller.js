import { asyncHandler } from "../../../Services/ErrorHandler.services.js";
import cloudinary from "../../../config/cloudinary.config.js";

export const createProduct = asyncHandler(async (req, res, next) => {
    // Get the uploaded files
    const { mainImage, subImage } = req.files;
    return res.json({mainImage, subImage})
    // Get other product data from request body
    const productData = req.body;
    
    // Upload main image to Cloudinary if exists
    if (mainImage) {
        const mainImageResult = await cloudinary.uploader.upload(mainImage[0].path, {
            folder: "products/main"
        });
        productData.mainImage = {
            url: mainImageResult.secure_url,
            public_id: mainImageResult.public_id
        };
    }
    
    // Upload sub images to Cloudinary if exist
    if (subImage) {
        const subImagePromises = subImage.map(img => 
            cloudinary.uploader.upload(img.path, {
                folder: "products/sub"
            })
        );
        const subImageResults = await Promise.all(subImagePromises);
        productData.subImages = subImageResults.map(result => ({
            url: result.secure_url,
            public_id: result.public_id
        }));
    }

    // TODO: Add your database logic here to save the product
    // const product = await Product.create(productData);

    res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: {
            ...productData,
            // Include image URLs in response for testing
            mainImageUrl: productData.mainImage?.url,
            subImageUrls: productData.subImages?.map(img => img.url)
        }
    });
});

export const getProductDetails = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    // TODO: Add your database logic here to fetch the product
    // const product = await Product.findById(id);

    // For now, returning a mock response
    res.status(200).json({
        success: true,
        message: "Product details retrieved successfully",
        data: {
            id,
            // Add other product details here
        }
    });
}); 