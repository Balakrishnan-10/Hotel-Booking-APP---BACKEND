import bcryptjs from "bcryptjs";
import User from "../Models/UserModel.js";
import { errorHandler } from "../Utils/Error.js";

// Update User API - /api/user/update/:id
export const UpdateUser = async (req, res, next) => {
  if (req.user.id != req.params.id) {
    return next(errorHandler(401, "You are not allowed to Upadate the User"));
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, "Password must be atleast 6 characters"));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }

  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(
        errorHandler(400, "Username must be between 7 to 20 characters")
      );
    }
    if (req.body.username.includes(" ")) {
      return next(errorHandler(400, "Username cannot contain Spaces"));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, "Username must be Lowercase"));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "Username can only contain letters and numbers")
      );
    }
  }
  try {
    const UpdatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      {
        new: true,
      }
    );

    const { password, ...rest } = UpdatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Get all user API - /api/user/all-users
export const getAllUsers = async (req, res) => {
  try {
    const getUsers = await User.find();
    res.status(200).json(getUsers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error by GET all hotels" });
  }
};

// Get user By Id :
export const getUserById = async (req, res, next) => {
  try {
    // Retrieve the user by their ID
    const user = await User.findById(req.params.userId);

    // Check if the user exists
    if (!user) {
      return next(errorHandler(404, "User ID not found"));
    }

    // Remove the password from the user object
    const { password, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Delete User API - /api/user/delete/:id
export const DeleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(403, "You are not allowed to delete this User"));
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted Successfully" });
  } catch (error) {
    next(error);
  }
};
