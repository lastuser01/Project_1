const express=require("express");
const router=express.Router({mergeParams:true});
const WrapAsync=require("../public/js/WrapAsync");
const {isLoggedIn}=require("../middlewares/isloggedin.js")
const {validatereview}=require("../middlewares/isloggedin.js");
const ReviewController = require("../controllers/review.js");


router.post("/",isLoggedIn,validatereview,WrapAsync(ReviewController.createReview))

router.delete("/:reviewid",isLoggedIn,WrapAsync(ReviewController.deleteReview))

module.exports=router;