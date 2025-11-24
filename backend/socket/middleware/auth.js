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
    // Handle JWT expiration cleanly without crashing the server
    if (err.name === "TokenExpiredError") {
      // Log once for monitoring, but don't spam console
      // console.warn("Socket connection attempted with expired token");
      return next(new Error("Token expired - please login again"));
    }
    
    if (err.name === "JsonWebTokenError") {
      return next(new Error("Invalid token format"));
    }
    
    // For any other JWT errors
    console.error("Socket auth error:", err.message);
    return next(new Error("Authentication failed"));
  }
  
  // TODO: Implement refresh token mechanism for socket reconnection
  // When token expires, client should refresh and reconnect with new token
}
