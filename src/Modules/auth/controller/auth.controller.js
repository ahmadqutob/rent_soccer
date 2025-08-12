import userModel from "../../../../database/Models/user.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../../../Services/ErrorHandler.services.js";
import { compare, hash } from "bcrypt";
import bcrypt from "bcrypt";
import { sendEmail } from "../../../Services/SendEmail.services.js";
import { customAlphabet } from "nanoid";
import crypto from "crypto";

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });

  if (!user) {
    return next(new Error("Email does't exist", { cause: 404 }));
  }

  // Optional: verify email is confirmed
  if (!user.confirmEmail) {
    return next(new Error("Please verify your email", { cause: 401 }));
  }
  const match = await compare(password, user.password);

  if (!match) {
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_SIGNATURE,
      { expiresIn: "12h" }
    );
    return res.json({ message: "Login successful", token });
  } else {
    return next(new Error("Password is invalid", { cause: 401 }));
  }
};

export const signup = asyncHandler(async (req, res, next) => {
  const { userName, password, email, phone, role, gender } = req.body;
  // 1 check is user exist
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already registered" });
    // re direct to login page
  }

  // 2- hash password
  const hashPassword = await bcrypt.hash(password, 8);

  //  3- Generate {email verification} token
  const tokenId = crypto.randomUUID(); //unique id for each token
  const emailToken = jwt.sign(
    { email, tokenId },
    process.env.CONFIRM_SIGNATURE,
    { expiresIn: "1h" }
  );

  // 4- Save user with confirmEmail = false
  const newUser = await userModel.create({
    userName,
    password: hashPassword,
    email,
    phone,
    role,
    gender,
    confirmEmail: false,
    forgetPassword: null,
    verificationTokenId: tokenId,
  });
  await newUser.save();

  // 5- ConfirmEmail link

  const linkToConfirmEmail = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${emailToken}`;
  const emailHtml = `
<h1>Welcome to Soccer Rent</h1>
<p>Please verify your email by clicking the link below:</p>
<a href="${linkToConfirmEmail}" target="_blank">Verify Email</a>

`;
  req.user = newUser;

  // 6- Send email
  //await sendEmail(email, "Confirm your email",emailHtml);

    const emailSent = await sendEmail(email, "Confirm your email", emailHtml);
    

     // 7- Rollback user creation if email sending failed
    if (!emailSent || !emailSent.success) {
      await userModel.deleteOne({ _id: newUser._id });
      return res.status(500).json({ message: "Failed to send email. Please try again." });
    }
 
     // 8- Success response
  return res.status(201).json({
    message: "Signup successful! Please check your email to confirm.",
  });
});

export const confairmEmails = asyncHandler(async (req, res, next) => {
  const { token } = req.params;

  const decoded = await jwt.verify(token, process.env.CONFIRM_SIGNATURE);
  const checkuser = await userModel.findOne({ email: decoded.email });
  // Validate token payload
   if (
    !decoded ||
    !decoded.email ||
    typeof decoded.email !== "string" ||
    checkuser.verificationTokenId !== decoded.tokenId
  ) {
    return next(new Error(" Invalid token payload ", { cause: 400 }));
  }

  // Check token expiration explicitly
  if (decoded.exp && Date.now() >= decoded.exp * 1000) {
    return next(new Error("Token expired", { cause: 401 }));
  }
  const user = await userModel.updateOne(
    { email: decoded.email },
    { confirmEmail: true, tokenId: null } // remove tokenId so it can't be reused
  );

  return res.status(200).json({ message: "Email confirmed" });
  // return res.status(200).redirect(`${process.env.FRONTEND_URL}`); //login page url
});

export const checkConfirmEmail = asyncHandler(async (req, res, next) => {
  const { email } = req.params;
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  if (!user.confirmEmail) {
    return next(new Error("Email not confirmed", { cause: 401 }));
  }
  return res.status(200).json({ message: "Email confirmed" });
});

export const sendCode = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  console.log("Email received:", email);

  const user = await userModel.findOne({ email });
  console.log("User found:", user);

  if (!user) {
    return next(new Error("Email does not exist"));
  }
  if (!user.confirmEmail) {
    return next(new Error("Please verify your email"));
  }

  // Initialize the customAlphabet generator
  const generateCode = customAlphabet("0123456789", 6);
  const code = generateCode();
  console.log("Generated code:", code);

  try {
    // Send email first
    await sendEmail(
      email,
      "Your verification code",
      `Your verification code is ${code}`
    );

    // Then update the database
    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      { $set: { forgetPassword: code } },
      { new: true }
    );
    console.log("Updated user:", updatedUser);

    if (!updatedUser) {
      console.log("Update failed - no user found");
      return next(new Error("Failed to update user"));
    }

    return res
      .status(200)
      .json({ message: "Code sent successfully", updatedUser });
  } catch (error) {
    console.error("Error in sendCode:", error);
    return next(new Error("Failed to process request: " + error.message));
  }
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { code, email, NEWpassword } = req.body;
  const user = await userModel.findOne({ email });

  if (!user) {
    return next(new Error("User not found"));
  }

  if (user.forgetPassword != code || !code) {
    return next(new Error("code is incorrect"));
  }

  const hashPass = await bcrypt.hash(NEWpassword, 8);
  user.password = hashPass;
  user.forgetPassword = null;
  user.changePasswordTime = Date.now();
  user.save();
  return res.json(user);
});

export const logout = asyncHandler(async (req, res, next) => {
  req.user.token = "";
  req.user.save();
  return res.json({ message: "Logged out" });
});

export const changePassword = asyncHandler(async (req, res, next) => {
  return res.json(req.user);
  const { oldPassword, newPassword, CnewPassword } = req.body;
  const user = req.user;
  if (user.password != oldPassword) {
    return next(new Error("old password is incorrect"));
  }
  if (newPassword != CnewPassword) {
    return next(new Error("new password is not match"));
  }
});
