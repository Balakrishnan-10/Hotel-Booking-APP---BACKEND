import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    pricePerDay: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      default:
        "https://i.pinimg.com/736x/95/7c/33/957c3317ad0aaaba4c03e967ccd82c3a.jpg",
    },
    amenities: {
      type: String,
      required: true,
    },
    rating: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "Uncategorized",
    },
    location: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Hotel = mongoose.model("hotels", hotelSchema);

export default Hotel;
