const express = require("express");
const WrapAsync = require("../public/js/WrapAsync");
const router = express.Router({ mergeParams: true });
let Booking = require("../models/Booking.js");
const User = require("../models/user.js");
const Listing = require("../models/Listings.js");

router.get("/:id", (req, res) => {
  if (req.user) {
    let listing_id = req.params.id;
    res.render("./listing/BookingForm.ejs", { id: listing_id });
  } else {
    req.flash("error", "login required!!!");
    res.redirect("/login");
  }
});

router.get(
  "/",
  WrapAsync(async (req, res) => {
    let userbookings;
    if (req.user) {
      let user1 = await User.findById(req.user._id).populate({
        path: "bookings",
        populate: { path: "listing" },
      });
      userbookings = user1.bookings;
    } else {
      userbookings = [];
    }
    res.render("./listing/Booking.ejs", { bookings: userbookings });
  })
);

router.post(
  "/:id",
  WrapAsync(async (req, res) => {
    let listingid = req.params.id;
    let booking = req.body.Booking;

    let booking1 = new Booking(booking);
    booking1.listing = listingid;

    let uid = req.user.id;
    let { price } = await Listing.findById(listingid);

    let user1 = await User.findById(uid);
    console.log(user1);

    user1.bookings.push(booking1.id);

    await booking1.save();
    await user1.save();
    console.log(booking1, user1);
    req.flash("booking added in cart");
    res.redirect("/booking");
  })
);

router.delete(
  "/:id",
  WrapAsync(async (req, res) => {
    let bookingid = req.params.id;
    await Listing.findById(bookingid.listing);
    await Booking.findByIdAndDelete(bookingid);
    res.redirect("/booking");
  })
);

module.exports = router;
