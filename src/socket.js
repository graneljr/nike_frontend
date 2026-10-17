import { io } from "socket.io-client";

const socket = io("https://nike-backend-cz93.vercel.app", {
  // Vercel does not keep successive Engine.IO polling requests on one
  // function instance. Connect directly over WebSocket instead.
  transports: ["websocket"],
});

export default socket;
