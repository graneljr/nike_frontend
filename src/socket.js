import { io } from "socket.io-client";

const socket = io("https://nike-backend-cz93.vercel.app");

export default socket;