import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./Databases/Config.js";
import AuthRoute from "./Routers/AuthRouter.js";
import UserRoute from "./Routers/UserRouter.js";
import hotelRoute from "./Routers/hotelRouter.js"
import bookingRoute from "./Routers/BookingRouter.js"
import commentRoute from "./Routers/CommentRouter.js"
import paymentRoute from "./Routers/PaymentRouter.js"
dotenv.config();

const app = express();

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use(express.json());

// Error Handling :
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Serval Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Connect DB :
connectDB();

// Default Route :
app.get("/", (req, res) => {
  res.send("Welcome to the Hotel Booking APP");
});

// Auth Route API :
app.use("/api/auth", AuthRoute);

// User Route API :
app.use("/api/user", UserRoute);

// Hotel Route API :
app.use("/api/hotel", hotelRoute);

// Booking Route API :
app.use("/api/booking", bookingRoute);

// Comment Route API :
app.use("/api/comments", commentRoute);

// Payment Route API :
app.use("/api/payment", paymentRoute);

// Display static image files:
app.use("/Uploads",express.static("Uploads"))

app.listen(process.env.PORT, () => {
  console.log("Server is running on the PORT");
});
