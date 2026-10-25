import { io } from "socket.io-client";

const socketUrl = import.meta.env.SOCKET_URL || (
  import.meta.env.DEV
    ? "http://localhost:3001"
    : "https://nike-backend-cz93.vercel.app"
);

const socket = io(socketUrl, {
  // Vercel does not keep successive Engine.IO polling requests on one
  // function instance. Connect directly over WebSocket instead.
  transports: ["websocket"],
});

export default socket;
