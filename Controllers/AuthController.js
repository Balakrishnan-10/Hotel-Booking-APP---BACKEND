import User from "../Models/UserModel.js";
import { errorHandler } from "../Utils/Error.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sendMail from "../Services/NodeMailer.js";
dotenv.config();

// Register User API - /api/auth/register-user
export const RegisterUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return next(errorHandler(400, "All fields are required"));
  }
  // Hashing the Password :
  const HashedPassword = bcryptjs.hashSync(password, 10);

  // Create the new USER :
  const NewUser = new User({ username, email, password: HashedPassword });

  try {
    await NewUser.save();
    res
      .status(200)
      .json({ message: "User Registered Succesfully", Result: NewUser });
  } catch (error) {
    next(error);
  }
};

// Login User API - /api/auth/login-user
export const LoginUser = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required"));
  }
  try {
    const UserDetails = await User.findOne({ email });
    const USerPassword = bcryptjs.compareSync(password, UserDetails.password);
    if (!UserDetails || !USerPassword) {
      return next(errorHandler(400, "Invalid Credentails"));
    }

    // JWT function :
    const token = jwt.sign(
      { id: UserDetails._id, isAdmin: UserDetails.isAdmin },
      process.env.JWT_SECRET_KEY
    );

    // Password not stoerd in DB function :
    const { password: passKey, ...rest } = UserDetails._doc;

    res
      .status(200)
      .json({ message: "User Loggedin Successfully", Result: rest, token });
  } catch (error) {
    next(error);
  }
};

// Google Auth API - /api/auth/googleauth
export const GoogleAuth = async (req, res, next) => {
  // Login User OAuth Function :
  const { name, email, profilePic } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      // JWT function :
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET_KEY
      );

      // Password not stored in DB function :
      const { password: passKey, ...rest } = user._doc;

      res
        .status(200)
        .json({ message: "User Loggedin Successfully", Result: rest, token });
    }

    // New User OAuth function :
    else {
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatePassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email: email,
        password: hashedPassword,
        profilePicture: profilePic,
      });
      await newUser.save();
      // JWT function :
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET_KEY
      );

      // Password not stoerd in DB function :
      const { password: passKey, ...rest } = newUser._doc;

      res
        .status(200)
        .json({ message: "User Registered Successfully", Result: rest, token });
    }
  } catch (error) {
    next(error);
  }
};

// Forgot Password API - /api/auth/forgot-password
export const ForgotPassword = async (req,res,next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return next(errorHandler(400, "User not found"));
    }

    // JWT part - Token created after signin :
    const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    const passwordReset = `http://localhost:5173/resetpassword/${user.id}/${token}`;
    const mailLink = await sendMail(
      user.email,
      "Reset Password",
      passwordReset
    );

    res.status(200).json({
      message: "Password reset link send to the provided Email",
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error Forgot Password" });
  }
};

// Reset Password API - /api/auth/reset-password
export const ResetPassword = async(req,res,next) => {
  
  try {
    const { id } = req.params;
    const { password, confirmPassword } = req.body;
    if (password != confirmPassword) {
      return next(errorHandler(400, "Password Doesn't Match"));
    }
    const hashPassword = await bcryptjs.hash(password, 10);
    const user = await User.findById({ _id: id });
    if (!user) {
      return next(errorHandler(404, "User Not Found"));
    }
    user.password = hashPassword;
    await user.save();
     res.status(200).json({ message: "password updated Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error Reset Password" });
  }
}

