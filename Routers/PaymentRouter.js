import express from "express";
import { createPayment } from "../Controllers/PaymentController.js";

const router = express.Router();

router.post("/checkout",createPayment);

export default router;
