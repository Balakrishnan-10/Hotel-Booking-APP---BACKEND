import Comment from "../Models/CommentModel.js";
import Hotel from "../Models/HotelModel.js";
import User from "../Models/UserModel.js";
import { errorHandler } from "../Utils/Error.js";

// Create Comment - /api/comments/create
export const createComment = async (req, res, next) => {
  try {
    const { userId, hotelId, content } = req.body;

    // Validate user input
    if (!userId || !hotelId || !content) {
      return next(
        errorHandler(400, "Please provide userId, hotelId, and content")
      );
    }

    // Find user and hotel by their IDs
    const user = await User.findById(userId);
    const hotel = await Hotel.findById(hotelId);

    // Check if user and hotel exist
    if (!user || !hotel) {
      return next(errorHandler(400, "Invalid userId or hotelId"));
    }

    // Create a new comment
    const newComment = new Comment({
      userId: user,
      hotelId: hotel,
      content,
    });

    // Save the comment to the database
    await newComment.save();

    // Return the newly created comment
    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
};

// Get Comments - /api/comments/getHotelComments/:hotelId
export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ hotelId: req.params.hotelId }).sort({
      createAt: -1,
    });
    res.status(201).json(comments);
  } catch (error) {
    next(error);
  }
};

// Like Comments - /api/comments/likeComments/:commentId
export const likeComments = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment ID Not found"));
    }
    const userIndex = comment.likes.indexOf(req.user.id);
    if (!userIndex === -1) {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    } else {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

// Edit Comments - /api/comments/edit/:commentId
export const editComments = async (req, res, next) => {
  try {
    // Find the comment by ID
    const comment = await Comment.findById(req.params.commentId);

    // Check if comment exists
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }

    // Update the comment
    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      { content: req.body.content },
      { new: true }
    );

    // Return the updated comment
    res.status(200).json({
      message: "Comment edited successfully",
      editedComment,
    });
  } catch (error) {
    // Pass any errors to the next middleware
    next(error);
  }
};

// Delete Comments - /api/comments/delete/:commentId
export const deleteComments = async (req, res, next) => {
  try {
     // Find the comment by ID
     const comment = await Comment.findById(req.params.commentId);

     await Comment.findByIdAndDelete(req.params.commentId);
     res.status(200).json({message:"Comment has been deleted "});
  } catch (error) {
    next(error);
  }
};