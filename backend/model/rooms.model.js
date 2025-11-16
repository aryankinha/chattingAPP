import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    _id: { type: String },

    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    lastMessage: {
      text: String,
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      createdAt: Date,
    },
  },
  { timestamps: true }
);
const Room = mongoose.model("Room", roomSchema);

export default Room;
