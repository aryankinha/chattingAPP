import User from "../model/user.model.js";

export default function registerUserStatusHandlers(io, socket, onlineUsers) {
  const userId = socket.userId;

  // Add user to online map
  onlineUsers.set(userId, socket.id);
  // console.log("User online:", userId);

  // Update database status
  User.findByIdAndUpdate(userId, { status: "online" }).catch(() => {});

  // Handle disconnect
  socket.on("disconnect", async () => {
    onlineUsers.delete(userId);

    await User.findByIdAndUpdate(userId, {
      status: "offline",
      lastSeen: new Date(),
    });

    // console.log("User offline:", userId);
  });
}
