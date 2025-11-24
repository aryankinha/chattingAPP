import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import usersRoutes from "./routes/users.routes.js";
import connectDB from "./config/db.js";
import http from "http";
import socketHandler from "./socket/index.js";
import friendRoutes from "./routes/friend.routes.js";
import messagesRoutes from "./routes/messages.routes.js";
import roomsRoutes from "./routes/room.routes.js";

dotenv.config();

const app = express();

const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// Initialize app first, then setup socket and start server
async function startServer() {
  try {
    // Connect to database first
    await connectDB(MONGO_URI);

    // Initialize Socket.io AFTER db connection
    const { io, onlineUsers } = await socketHandler(server);

    // Attach to app so routes can access them
    app.set("io", io);
    app.set("onlineUsers", onlineUsers);

    console.log("Socket.io initialized successfully");

    // Start server
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Socket.io ready on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

app.get("/", (req, res) => {
  res.send("Server is alive");
});

// Routes - registered BEFORE server starts
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/rooms", roomsRoutes);

// Start the server
startServer();
