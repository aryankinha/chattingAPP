import Room from "../model/rooms.model.js";
import Message from "../model/messages.model.js";

export default function registerChatHandlers(io, socket) {
  const userId = socket.userId;

  // JOIN ROOM
  socket.on("join-room", async ({ roomId }) => {
    socket.join(roomId);
    console.log(`User ${userId} joined room ${roomId}`);
  });

  // SEND MESSAGE
  socket.on("send-message", async ({ roomId, text }) => {
    // Save message in DB
    const msg = await Message.create({
      roomId,
      text,
      sender: userId,
    });

    // Update last message in room
    await Room.findByIdAndUpdate(roomId, {
      lastMessage: {
        text,
        sender: userId,
        createdAt: msg.createdAt,
      },
    });

    // Broadcast to everyone in that room
    io.to(roomId).emit("receive-message", msg);
  });
}
