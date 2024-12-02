import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    user: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "users",
      },
    ],
    hotel: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "hotels",
      },
    ],
    age: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    zipcode: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    checkindate: {
      type: String,
      required: true,
    },
    checkoutdate: {
      type: String,
      required: true,
    },
    totalmembers: {
      type: String,
      default:"1"
    },
    roomType: {
      type: String,
      default: "Uncategorized",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("bookings", BookingSchema);

export default Booking;
