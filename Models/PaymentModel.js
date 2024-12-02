import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    bookingId: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "bookings",
      },
    ],
    amount: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("payment", PaymentSchema);

export default Payment;
