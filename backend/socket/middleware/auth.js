import jwt from "jsonwebtoken";

export default function socketAuth(socket, next) {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("Authentication token missing"));
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    socket.userId = decoded.id; // attach to socket object
    next();
  } catch (err) {
    console.error("Socket auth error:", err.message);
    return next(new Error("Invalid token"));
  }
}
