import { Router } from "express";
import authorization from "../../Middleware/authorization.middleware.js";
import fileUpload from "../../Middleware/multer.middleware.js";
import { fileValidation } from "../../Middleware/multer.middleware.js";
import validation from "../../Middleware/validation.middleware.js";
import * as postValidation from "./post.validation.js";
import * as postController from "./Controller/Posts.controller.js";

const router = new Router();//Modular Routing

// Create football news post with image upload
router.post("/createPost", 
    authorization(["admin"]),  
    fileUpload(fileValidation.image).fields([
        {name:'mainImage', maxCount:1},
        {name:'subImage', maxCount:5},
    ]),
    validation(postValidation.createPost),
    postController.createPost
);

// Get all posts with filtering and pagination
router.get("/all", 
    validation(postValidation.getPosts),
    postController.getAllPosts
);

// Get posts by tag with filtering and pagination
router.get("/tag", 
    validation(postValidation.getPostsByTag),
    postController.getPostsByTag
);

// Get single post by ID
router.get("/:id", 
    validation(postValidation.postId),
    postController.getPostById
);

// Update post
router.put("/:id", 
    authorization(["admin", "user"]),
    fileUpload(fileValidation.image).fields([
        {name:'mainImage', maxCount:1},
        {name:'subImage', maxCount:5},
    ]),
    validation(postValidation.updatePost),
    postController.updatePost
);

// Delete post (soft delete)
router.delete("/:id", 
    authorization(["admin", "user"]),
    validation(postValidation.postId),
    postController.deletePost
);

 

export default router;