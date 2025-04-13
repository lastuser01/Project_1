const express=require("express");
const router=express.Router({mergeParams:true});
const WrapAsync=require("../public/js/WrapAsync");
const {isLoggedIn}=require("../middlewares/isloggedin.js")
const {isAdmin}=require("../middlewares/isloggedin.js");
const ListingController = require("../controllers/listing.js");


router.get("/",WrapAsync(ListingController.index)) 

router.get("/new",isLoggedIn,ListingController.rendernewForm)

router.get("/search",WrapAsync(ListingController.renderSearchForm))

router.get("/:id",WrapAsync(ListingController.renderIndivisualListing));

router.post("/",isLoggedIn,WrapAsync(ListingController.createListing)) 

router.get("/:id/update",isLoggedIn,WrapAsync(ListingController.renderUpdateForm)) 

router.patch("/:id",isLoggedIn,isAdmin,WrapAsync(ListingController.updateListing)) 

router.delete("/:id",isLoggedIn,isAdmin,WrapAsync(ListingController.deleteListing)) 

module.exports=router;