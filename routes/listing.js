const express = require("express");
const router = express.Router({ mergeParams: true });
const WrapAsync = require("../public/js/WrapAsync");
const { isLoggedIn } = require("../middlewares/isloggedin.js");
const { isAdmin } = require("../middlewares/isloggedin.js");
const ListingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(WrapAsync(ListingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    WrapAsync(ListingController.createListing)
  );

router.get("/new", isLoggedIn, ListingController.rendernewForm);

router.get("/search", WrapAsync(ListingController.renderSearchForm));

router.get(
  "/:id/update",
  isLoggedIn,
  WrapAsync(ListingController.renderUpdateForm)
);

router.post("/filter", WrapAsync(ListingController.applyFilter));

router
  .route("/:id")
  .get(WrapAsync(ListingController.renderIndivisualListing))
  .patch(
    isLoggedIn,
    isAdmin,
    upload.single("listing[image]"),
    WrapAsync(ListingController.updateListing)
  )
  .delete(isLoggedIn, isAdmin, WrapAsync(ListingController.deleteListing));

module.exports = router;
