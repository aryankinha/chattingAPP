import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL.replace(/\/api\/?$/, "");

const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket"],
  withCredentials: true,
});

export default socket;