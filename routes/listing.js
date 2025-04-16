const express=require("express");
const router=express.Router({mergeParams:true});
const WrapAsync=require("../public/js/WrapAsync");
const {isLoggedIn}=require("../middlewares/isloggedin.js")
const {isAdmin}=require("../middlewares/isloggedin.js");
const ListingController = require("../controllers/listing.js");


router.route("/")
        .get(WrapAsync(ListingController.index)) 
        .post(isLoggedIn,WrapAsync(ListingController.createListing)) 

router.get("/new",isLoggedIn,ListingController.rendernewForm)

router.get("/search",WrapAsync(ListingController.renderSearchForm))

router.get("/:id/update",isLoggedIn,WrapAsync(ListingController.renderUpdateForm)) 

router.route("/:id")
    .get(WrapAsync(ListingController.renderIndivisualListing))
    .patch(isLoggedIn,isAdmin,WrapAsync(ListingController.updateListing)) 
    .delete(isLoggedIn,isAdmin,WrapAsync(ListingController.deleteListing)) 

module.exports=router;