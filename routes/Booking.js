const express = require("express");
const WrapAsync = require("../public/js/WrapAsync");
const router = express.Router({ mergeParams: true });
let Booking = require("../models/Booking.js");

router.get("/:id", (req, res) => {
  let listing_id = req.params.id;
  res.render("./listing/BookingForm.ejs", { id: listing_id });
});

router.get("/", async (req, res) => {
  let id = req.user._id;
  let userbookings = await Booking.find({ user: id }).populate("listing");
  console.log(userbookings);
  res.render("./listing/Booking.ejs", { bookings: userbookings });
});

router.post(
  "/:id",
  WrapAsync(async (req, res) => {
    let listingid = req.params.id;
    // console.log(listingid);
    let booking = req.body.Booking;

    let booking1 = new Booking(booking);
    booking1.listing = listingid;
    booking1.user = req.user._id;

    await booking1.save();
    console.log(booking1);
    res.render("./listing/Booking.ejs");
  })
);

module.exports = router;
