const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

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

  socket.emit("newMessage", {
    from: "Admin",
    text: "Weclome to chat room",
  });

  //alert other users except this
  socket.broadcast.emit("newMessage", {
    from: "admin",
    text: "A new user is joined",
    createdAt: new Date().getTime(),
  });

  socket.on("createMessage", (newMessage) => {
    console.log("Create an message: ", newMessage);

    io.emit("newMessage", {
      from: newMessage.from,
      text: newMessage.text,
      createdAt: new Date().getTime(),
    });

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
