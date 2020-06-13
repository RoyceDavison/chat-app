const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const { Users } = require("./utils/users");
const { generateMessage, generateLocationMessage } = require("./utils/message");
const { isRealString } = require("./utils/validation");
const publicPath = path.resolve(__dirname, "../public");
const PORT = process.env.PORT || 3000;

var app = express(); //express server
app.use(express.static(publicPath));
var server = http.createServer(app); //http server
var io = socketIO(server); //web socket server
var users = new Users();
//io.emit: emit to every connections
//socket.broadcast.emit: emit to everyone connected to the socket except the current user
//socket.emit:emit an event specifically to one user

//io.on() register an event listener
//socket.emit() --> emit an event to a single connection, io.emit() --> emit an event to every connections
io.on("connection", (socket) => {
  console.log("A new user is connected");

  socket.on("join", (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback("Name and room are required.");
    }
    socket.join(params.room);
    //socket.leave(params.room);

    //logic: when the user enter the room, remove it from
    //preivious room and then add it into a new room
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit("updateUserList", users.getUserList(params.room));
    socket.emit("newMessage", generateMessage("Admin", "Weclome to chat room"));

    socket.broadcast
      .to(params.room)
      .emit(
        "newMessage",
        generateMessage("Admin", `${params.name} has joined!`)
      );

    io.to().emit(); //send an message to every connects that are attached to the room
    //sucesful
    callback();
  });

  socket.on("createMessage", (newMessage, callback) => {
    //console.log("Create an message: ", newMessage);
    var user = users.getUser(socket.id);
    if (user && isRealString(newMessage.text)) {
      io.to(user.room).emit(
        "newMessage",
        generateMessage(user.name, newMessage.text)
      );
    }

    //send ACK the client via callback()
    callback("ACK from the server");
  });

  // socket.on("createLocationMessage", (coords) => {
  //   io.emit(
  //     "newMessage",
  //     generateMessage("Admin", `${coords.latitude}, ${coords.longitude}`)
  //   );
  // });

  socket.on("createLocationMessage", (coords) => {
    var user = users.getUser(socket.id);
    if (user && coords) {
      io.to(user.room).emit(
        "newLocationMessage",
        generateLocationMessage(user.name, coords.latitude, coords.longitude)
      );
    }
  });

  socket.on("disconnect", () => {
    var user = users.removeUser(socket.id);
    console.log(user);
    if (user) {
      io.to(user.room).emit("updateUserList", users.getUserList(user.room)); //update the client userList
      io.to(user.room).emit(
        "newMessage",
        generateMessage("Admin", `${user.name} has left.`)
      ); //send message to everyone in the room X leaves the room
    }
    console.log("Disconnected a client");
  });
});

server.listen(PORT, () => {
  console.log("------CHAT APP START------" + PORT);
});
