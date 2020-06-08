const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const { generateMessage } = require("./utils/message");
const publicPath = path.resolve(__dirname, "../public");
const PORT = process.env.PORT || 3000;

var app = express(); //express server
app.use(express.static(publicPath));
var server = http.createServer(app); //http server
var io = socketIO(server); //web socket server

//io.on() register an event listener
//socket.emit() --> emit an event to a single connection, io.emit() --> emit an event to every connections
io.on("connection", (socket) => {
  console.log("A client is connected");

  socket.emit("newMessage", generateMessage("Admin", "Weclome to chat room"));

  //alert other users except this
  socket.broadcast.emit(
    "newMessage",
    generateMessage("Admin", "A new user is joined")
  );

  socket.on("createMessage", (newMessage) => {
    console.log("Create an message: ", newMessage);

    io.emit("newMessage", generateMessage(newMessage.from, newMessage.text));

    //传播给所有其他人除了我自己
    // socket.broadcast.emit("newMessage", {
    //   from: newMessage.from,
    //   text: newMessage.text,
    //   createdAt: new Date().getTime(),
    // });
  });

  socket.on("disconnect", (socket) => {
    console.log("Disconnected a client");
  });
});

server.listen(PORT, () => {
  console.log("------CHAT APP START------" + PORT);
});
