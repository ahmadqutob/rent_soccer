import mongoose, { Schema, model, Types } from "mongoose";
// console.log("User model loaded");

const userSchema = new Schema({
  userName: {
    type: String,
    required: [true, "Username is required"],
    minlength: [2, "Username must be at least 2 characters long"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  changePasswordTime: {
    type: Date,
  },
  forgetPassword: {
    type: String,
    default: "",
  } ,
  confirmEmail: {
    type: Boolean,
    default: false,
    required: [true, "Email confirmation status is required"],
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: [true, "Gender is required"],
  },
  wishlist: [{
    type: Types.ObjectId,
    ref: "Product",
  }],
  verificationTokenId:{
    type: String,
    default: null,
  }
}, {
  timestamps: true,
});

const userModel = mongoose.models.User || model("User", userSchema);
export default userModel;
