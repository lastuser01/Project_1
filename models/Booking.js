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
  arrival_time: {
    type: String,
    required: true,
  },
  ampm: {
    type: String,
    required: true,
  },
  dept_day: {
    type: Number,
    required: true,
  },
  dept_month: {
    type: Number,
    required: true,
  },
  dept_year: {
    type: Number,
    required: true,
  },
  listing: {
    type: Schema.Types.ObjectId,
    ref: "Listing",
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Bookings", booking_schema);
