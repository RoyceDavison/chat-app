var socket = io();
socket.on("connect", function () {
  console.log("Connect to a server");
});

socket.on("disconnect", function () {
  console.log("Disconnect from a server ");
});

socket.on("newMessage", function (message) {
  console.log("New message: ", message);
  var li = jQuery("<li></li>");
  li.text(`${message.from}: ${message.text}`);
  jQuery("#messages").append(li);
});

// socket.emit(
//   "createMessage",
//   {
//     from: "Frank",
//     text: "hi",
//   },
//   function (data) {
//     console.log(data);
//   }
// );

//add an event listener for the form submit
jQuery("#message-form").on("submit", function (e) {
  e.preventDefault();
  socket.emit(
    "createMessage",
    {
      from: "User",
      text: jQuery("[name=message]").val(),
    },
    function (data) {
      console.log(data);
    }
  );
});
