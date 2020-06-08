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

// socket.on("newLocationMessage", function (message) {
//   console.log("newLocationMessage: ", message);
//   var li = jQuery("<li></li>");
//   var a = jQuery(`<a target="_blank">My Current Location</a>`);
//   li.text(`${message.from}: `);
//   a.attr("href", message.url);

//   li.append(a);
//   jQuery("#messages").append(li);
// });

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

var locationButton = jQuery("#send-location");
locationButton.on("click", function () {
  if (!navigator.geolocation) {
    return alert("Geolocation not supported by your browser.");
  }

  navigator.geolocation.getCurrentPosition(
    function (position) {
      socket.emit("createLocationMessage", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    function () {
      alert("Unable to fetch location.");
    }
  );
});
