import Booking from "../Models/BookingModel.js";
import User from "../Models/UserModel.js";
import Hotel from "../Models/HotelModel.js";
import { errorHandler } from "../Utils/Error.js";

export const createBooking = async (req, res, next) => {
  const { user, hotel } = req.body;
  // console.log("UserId :" + user, "HotelId :" + hotel);
  const users = await User.findById({ _id: user });
  // console.log(users);
  const hotels = await Hotel.findById({ _id: hotel });
  // console.log(hotels);
  if (!users || !hotels) {
    return next(errorHandler(400, "Invalid Hotel ID and User ID"));
  }
  const bookingDetails = {
    user: users,
    hotel: hotels,
    age: req.body.age,
    address: req.body.address,
    zipcode: req.body.zipcode,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
    phone: req.body.phone,
    checkindate: req.body.checkindate,
    checkoutdate: req.body.checkoutdate,
    totalmembers: req.body.totalmembers,
  };
  const newBooking = new Booking(bookingDetails);
  try {
    const savedBooking = await newBooking.save();
    res
      .status(200)
      .json({ message: "Your Booking is confirmed", result: savedBooking });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error by create booking method" });
  }
};

export const getBooking = async (req, res) => {
  try {
    const getbookings = await Booking.findOne()
      .populate("user")
      .populate("hotel");
    res
      .status(200)
      .json( getbookings );
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error by GET all Bookings" });
  }
};
