import Room from "../model/rooms.model.js";

export const getMyRooms = async (req, res) => {
  try {
    const userId = req.user.id;

    const rooms = await Room.find({
      participants: userId
    })
      .populate("participants", "name email avatar status lastSeen")
      .sort({ "lastMessage.createdAt": -1 });

    return res.status(200).json({
      success: true,
      rooms
    });

  } catch (err) {
    console.error("Get Rooms Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
