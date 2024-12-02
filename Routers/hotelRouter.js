import express from "express";
import {
  createNewHotel,
  deleteHotelById,
  editHotelById,
  fetchHotelById,
  getAllHotels,
} from "../Controllers/hotelController.js";
import { verifyToken } from "../Middleware/VerifyToken.js";

const router = express.Router();

router.post("/create/new", verifyToken, createNewHotel);
router.get("/all-hotels", getAllHotels);
router.get("/single/:id", fetchHotelById);
router.put("/edit/:id", verifyToken, editHotelById);
router.delete("/delete/:id", verifyToken, deleteHotelById);

export default router;
