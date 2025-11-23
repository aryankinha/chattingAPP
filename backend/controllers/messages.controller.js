import Room from "../model/rooms.model.js";
import Message from "../model/messages.model.js";
import Friendship from "../model/friend.model.js";

// GET /messages/:roomId - Fetch all messages for a room
export const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;

    if (!roomId) {
      return res.status(400).json({ message: "Room ID is required" });
    }

    // Check if room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Verify user is a participant of the room
    if (!room.participants.includes(userId)) {
      return res.status(403).json({ message: "You are not a participant of this room" });
    }

    // Fetch messages for the room, populate sender info
    const messages = await Message.find({ roomId })
      .populate("sender", "name email avatar")
      .sort({ createdAt: 1 }); // Sort by oldest first

    return res.status(200).json({
      success: true,
      messages,
      count: messages.length
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ 
      success: false,
      message: "Failed to fetch messages" 
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { roomId, text, attachment } = req.body;

    if (!roomId || (!text && !attachment)) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // Check if room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Determine the other participant
    const receiverId = room.participants.find(id => id.toString() !== senderId);

    // Check if users are still friends
    const friendship = await Friendship.findOne({
      status: "accepted",
      $or: [
        { requester: senderId, recipient: receiverId },
        { requester: receiverId, recipient: senderId }
      ]
    });

    if (!friendship) {
      return res.status(403).json({ message: "You are not friends anymore" });
    }

    // Create message
    const message = await Message.create({
      roomId,
      sender: senderId,
      text,
      attachment: attachment || "",
      readBy: [senderId],
    });

    // Populate sender info for the response
    await message.populate("sender", "name email avatar");

    // Update room's lastMessage
    room.lastMessage = {
      text: text || "📎 Attachment",
      sender: senderId,
      createdAt: new Date(),
    };
    await room.save();

    // SEND REAL-TIME MESSAGE
    const io = req.app.get("io");
    if (io) {
      const messageData = {
        ...message.toObject(),
        roomLastMessage: room.lastMessage,
      };
      io.to(roomId).emit("new-message", messageData);
      // console.log(`✅ Message emitted to room ${roomId}:`, {
      //   sender: message.sender.name,
      //   text: message.text,
      //   roomId: roomId
      // });
    } else {
      console.error("❌ Socket.io instance not found on app");
    }

    return res.status(201).json({ 
      success: true,
      message: "Message sent", 
      data: message 
    });

  } catch (err) {
    console.error("Send Message Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
