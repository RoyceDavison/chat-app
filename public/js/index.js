var socket = io();
socket.on("connect", function () {
  console.log("Connect to a server");
});

socket.on("disconnect", function () {
  console.log("Disconnect from a server ");
});

socket.on("newMessage", function (message) {
  console.log("New message: ", message);
});
