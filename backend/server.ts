import { Server } from "socket.io";

export default async ({ strapi }) => {
  const io = new Server(strapi.server.httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("sendMessage", (message) => {
      console.log("Message received:", message);
      io.emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  strapi.io = io; // Attach WebSocket instance to Strapi
};
