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
io.on("connection", (socket) => {
  console.log("A client is connected");
  socket.on("disconnect", (socket) => {
    console.log("Disconnected a client");
  });
});

// app.listen(PORT, () => {
//   console.log("------CHAT APP START------" + PORT);
// });

server.listen(PORT, () => {
  console.log("------CHAT APP START------" + PORT);
});
