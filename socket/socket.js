const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");

const express = require("express");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:10000"],
    methods: ["GET", "POST"],
  },
});


app.use(cors({
  origin: 'http://localhost:10000',
  methods: ['GET', 'POST'],
}));

const getReceiverSocketId = (receiverId) => {

  return userSocketMap[receiverId];

}

const userSocketMap = {}; // {userId : socket.id}

io.on("connection", (socket) => {
  console.log("a user connected ", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId != "undefined") {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("user disconnected ", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

//module.exports what to do i dont use import module so i am not able to export like this
module.exports = { app, io, server, getReceiverSocketId };
