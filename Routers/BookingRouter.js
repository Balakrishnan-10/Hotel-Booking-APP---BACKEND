import express from "express";
import { createBooking, getBooking } from "../Controllers/BookingController.js";
import { verifyToken } from "../Middleware/VerifyToken.js";

const router = express.Router();

router.post("/new",verifyToken, createBooking);
router.get("/get-booking", getBooking);

export default router;
