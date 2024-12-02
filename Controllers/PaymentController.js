import Stripe from "stripe";
import Payment from "../Models/PaymentModel.js";
import dotenv from "dotenv";
import Booking from "../Models/BookingModel.js";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPayment = async (req, res) => {
  const frontend_url = process.env.FRONTEND_URL;

  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: "Booking ID is required" });
    }

    const booking = await Booking.findById(bookingId)
      .populate("user")
      .populate("hotel");
    console.log(booking);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const existingPayment = await Payment.findOne({ bookingId });
    if (existingPayment) {
      return res
        .status(400)
        .json({ message: "Payment already exists for this booking" });
    }

    const lineItems = [
      {
        price_data: {
          currency: "usd",
          unit_amount: Math.round(booking.hotel[0].pricePerDay * 100), // Convert to cents
          product_data: {
            name: booking.hotel[0].title,
            images: [booking.hotel[0].image],
          },
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types:["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${frontend_url}?success=true`,
      cancel_url: `${frontend_url}?canceled=true`,
      customer_email: booking.user[0].email,
    });

    if (!session) {
      return res
        .status(500)
        .json({ message: "Failed to create payment session" });
    }
    console.log(booking.hotel[0].pricePerDay);
    const payment = new Payment({
      bookingId,
      amount: booking.hotel[0].pricePerDay,
      sessionId: session.id,
    });

    await payment.save();

    res.status(200).json({
      message: "Payment session created successfully",
      session_url: session.url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error creating payment session",
      error: error.message,
    });
  }
};
