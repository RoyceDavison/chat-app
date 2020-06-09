const moment = require("moment");

//Unix epic: Jan 1st 1970 00:00:00 am
// var date = moment();
// date.add(1, "year");

// console.log(date.format("MMM Do, YYYY"));

var date = moment();
console.log(date.valueOf());
console.log(date.format("h:mm a"));
