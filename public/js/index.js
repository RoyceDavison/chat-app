var socket = io();

socket.on("connect", function () {
  console.log("Connect to a server");
});

socket.on("disconnect", function () {
  console.log("Disconnect from a server ");
});

socket.on("newMessage", function (message) {
  var formatTime = moment(message.createdAt).format("h:mm a");
  //use Mustache bu copying mustache.js ---> "raw", from github into js/lib/mustache.js
  var template = jQuery("#message-template").html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formatTime,
  });
  jQuery("#messages").append(html);

  // var formatTime = moment(message.createdAt).format("h:mm a");
  // var li = jQuery("<li></li>");
  // li.text(`${message.from} ${formatTime}: ${message.text}`);
  // jQuery("#messages").append(li);
});

socket.on("newLocationMessage", function (message) {
  //console.log("newLocationMessage: ", message);
  var formatTime = moment(message.createdAt).format("h:mm a");
  var template = jQuery("#location-message-template").html();
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formatTime,
  });
  jQuery("#messages").append(html);

  // var li = jQuery("<li></li>");
  // var a = jQuery(`<a target="_blank">My Current Location</a>`);
  // li.text(`${message.from} ${formatTime}: `);
  // a.attr("href", message.url);

  // li.append(a);
  // jQuery("#messages").append(li);
});

//add an event listener for the form submit
jQuery("#message-form").on("submit", function (e) {
  e.preventDefault();
  var messageTextBoard = jQuery("[name=message]");

  socket.emit(
    "createMessage",
    {
      from: "User",
      text: messageTextBoard.val(),
    },
    function (data) {
      //ack from server
      return messageTextBoard.val("");
    }
  );
});

var locationButton = jQuery("#send-location");
locationButton.on("click", function () {
  if (!navigator.geolocation) {
    return alert("Geolocation not supported by your browser.");
  }

  locationButton.attr("disabled", "disabled").text("Sending Location...");

  navigator.geolocation.getCurrentPosition(
    function (position) {
      locationButton.removeAttr("disabled").text("Send Loaction");
      socket.emit("createLocationMessage", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    function (err) {
      locationButton.removeAttr("disabled").text("Send Location");
      alert("Unable to fetch location.");
    },
    { timeout: 10000 }
  );
});
