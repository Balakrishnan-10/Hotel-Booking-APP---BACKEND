import express from "express";
import {
  DeleteUser,
  getAllUsers,
  getUserById,
  UpdateUser,
} from "../Controllers/UserController.js";
import { verifyToken } from "../Middleware/VerifyToken.js";

const router = express.Router();

router.put("/update/:id", verifyToken, UpdateUser);
router.get("/all-users", getAllUsers);
router.delete("/delete/:id", verifyToken, DeleteUser);
router.get("/:userId",getUserById)

export default router;
