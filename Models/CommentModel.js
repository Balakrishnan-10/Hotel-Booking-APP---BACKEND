import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    userId: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "users",
      },
    ],
    hotelId: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "hotels",
      },
    ],
    content: {
      type: String,
      required: true,
    },
    likes: {
      type: Array,
      default: [],
    },
    numberOfLikes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("comments", commentSchema);

export default Comment;
