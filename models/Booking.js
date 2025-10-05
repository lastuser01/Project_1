const { ref } = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;

let booking_schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  guests: Number,
  arrival_date: {
    type: Date,
    required: true,
  },
  dept_date: {
    type: Date,
  },
  listing: {
    type: Schema.Types.ObjectId,
    ref: "Listing",
  },
});

module.exports = mongoose.model("Bookings", booking_schema);
