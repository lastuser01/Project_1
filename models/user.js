const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const Booking = require("./Booking");

let userschema = new Schema({
  email: {
    type: String,
    required: true,
  },
  bookings: [
    {
      type: Schema.Types.ObjectId,
      ref: Booking,
    },
  ],
});

userschema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userschema);
