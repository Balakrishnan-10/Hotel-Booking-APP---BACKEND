import express from "express";
import {
  ResetPassword,
  ForgotPassword,
  GoogleAuth,
  LoginUser,
  RegisterUser,
} from "../Controllers/AuthController.js";
//import { verifyToken } from "../Middleware/VerifyToken.js";

const router = express.Router();

router.post("/register-user", RegisterUser);
router.post("/login-user", LoginUser);
router.post("/googleauth", GoogleAuth);
router.post("/forgot-password", ForgotPassword);
router.post("/reset-password/:id", ResetPassword);

export default router;
