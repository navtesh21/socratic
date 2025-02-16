import { io, Socket } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.NODE_ENV === "production"
    ? undefined
    : "https://socratic-backend.onrender.com";

let socket: Socket;

const getSocket = () => {
  if (!socket) {
    socket = io("https://socratic-backend.onrender.com", {
      autoConnect: false,
    });
  }
  return socket;
};

export default getSocket;
