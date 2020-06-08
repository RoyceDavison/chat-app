var expect = require("expect");
var { generateMessage, generateLocationMessage } = require("./message");

describe("generateMessage", () => {
  it("should generate correct message object", () => {
    var from = "royce";
    var text = "hello from royce";

    var message = generateMessage(from, text);

    expect(typeof message.createdAt).toBe("number");
    expect(message).toMatchObject({
      from,
      text,
    });
  });
});

describe("generateLocationMessage", () => {
  it("should generate correct location object", () => {
    var from = "Admin";
    var lat = 15,
      lon = 19;
    var url = `https://www.google.com/maps?q=${lat},${lon}`;

    var message = generateLocationMessage(from, lat, lon);

    expect(typeof message.createdAt).toBe("number");
    expect(message).toMatchObject({
      from,
      url,
    });
  });
});
