import { Server } from "socket.io";
import socketAuth from "./middleware/auth.js";
import registerUserStatusHandlers from "./userStatus.js";
import registerFriendHandlers from "./friend.js";
import registerChatHandlers from "./chat.js";

const onlineUsers = new Map();

export default function socketHandler(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // middleware (token check)
  io.use(socketAuth);

  io.on("connection", (socket) => {
    console.log("New socket:", socket.id);

    // user online/offline tracking
    registerUserStatusHandlers(io, socket, onlineUsers);

    // friend request events
    registerFriendHandlers(io, socket, onlineUsers);

    // chat events (rooms, messages)
    registerChatHandlers(io, socket);

  });
}
