import Hotel from "../Models/HotelModel.js";
import { errorHandler } from "../Utils/Error.js";
import mongoose from "mongoose";

// Create a New Hotel API - /api/hotel/create/new
export const createNewHotel = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(
      errorHandler(403, "You are not allowed to create hotel details")
    );
  }
  try {
    const {
      title,
      description,
      pricePerDay,
      amenities,
      category,
      location,
      rating,
      image,
    } = req.body;

    const newHotel = new Hotel({
      title,
      description,
      pricePerDay,
      amenities,
      category,
      location,
      rating,
      image,
    });
    await newHotel.save();
    res.status(200).json({
      message: "Create a New Hotel details successfully",
      newHotel,
    });
  } catch (error) {
    next(errorHandler(500, "Internal error by creating New Hotel"));
  }
};

// Get all hotel's details API - /api/hotel/all-hotels
export const getAllHotels = async (req, res) => {
  try {
    const query = req.query;
    const searchQuery = query.search;

    if (!searchQuery) {
      const hotels = await Hotel.find();
      res.status(200).json(hotels);
    } else {
      const [field, value] = searchQuery.split(":");

      const filter = {};
      filter[field] = { $regex: value, $options: "i" };

      const hotels = await Hotel.find(filter);
      res.status(200).json(hotels);
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error by GET all hotels" });
  }
};

// Fetch hotel by ID  API - /api/hotel/single/:id
export const fetchHotelById = async (req, res, next) => {
  try {
    const id = req.params.id;
    // Validate - if the ID is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(errorHandler(400, "Invalid Hotel ID"));
    }
    const getHotelsById = await Hotel.findById(id);
    if (!getHotelsById) {
      res.status(404).json({ message: "Hotel not found" });
    }
    res.status(200).json({ message: "Hotel Details", result: getHotelsById });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error by GET Hotel by ID" });
  }
};

// Edit hotel details by ID - /api/hotel/edit/:id
export const editHotelById = async (req, res, next) => {
  try {
    const id = req.params.id;
    // Validate - if the ID is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(errorHandler(400, "Invalid Hotel ID"));
    }
    // Check User role :
    if (!req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not allowed to edit hotel details")
      );
    }
    const editHotel = await Hotel.findById(id);
    if (!editHotel) {
      res.status(404).json({ message: "Invalid Hotel Details" });
    }

    const updateHotel = await Hotel.findByIdAndUpdate(
      id,
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          pricePerDay: req.body.pricePerDay,
          amenities: req.body.amenities,
          category: req.body.category,
          location: req.body.location,
          rating: req.body.rating,
        },
      },
      { new: true }
    );
    res.status(200).json({
      message: "Hotel Details updated successfully",
      result: updateHotel,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server Error by Hotel Updated method" });
  }
};

// Delete hotel by ID - /api/hotel/delete/:id
export const deleteHotelById = async (req, res, next) => {
  try {
    const id = req.params.id;
    // Validate - if the ID is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(errorHandler(400, "Invalid Hotel ID"));
    }
    // Check User role :
    if (!req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not allowed to delete hotel details")
      );
    }
    const deleteHotel = await Hotel.findById(id);
    if (!deleteHotel) {
      res.status(404).json({ message: "Invalid Hotel Details" });
    }

    //Delete product from DB:
    await deleteHotel.deleteOne();
    return res.status(200).json({
      message: "Hotel Details Deleted Successfully",
      result: deleteHotel,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server Error by Hotel deleted method" });
  }
};
