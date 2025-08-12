import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Category name is required"],
        unique: true,
        trim: true,
        minlength: [2, "Category name must be at least 2 characters long"]
    },
 
    image: {
        url: {
            type: String,
            required: [true, "Category image URL is required"]
        },
        public_id: {
            type: String,
            required: [true, "Category image public ID is required"]
        }
    }
}, {
    timestamps: true
});

const categoryModel = mongoose.model("Category", categorySchema);
export default categoryModel;