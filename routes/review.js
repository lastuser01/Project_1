const express=require("express");
const router=express.Router({mergeParams:true});
let Review=require("../models/Reviews.js")
let Listing=require("../models/Listings.js");
let {review_schema}=require("../schema.js")
const WrapAsync=require("../public/js/WrapAsync");

const validatereview=(req,res,next)=>{
    let {error}=review_schema.validate(req.body)
    if(error){
        let errmsg=error.details.map((el)=>{el.message}).join(",")
        throw new ExpressError(400,errmsg)
    }
    else{
        next()
    }
}


router.post("/",validatereview,WrapAsync(async(req,res)=>{
    let{ id}=req.params;
    let listing=await Listing.findById(id);
    let n_review=new Review(req.body.review);
    listing.reviews.push(n_review)

    await n_review.save()
    await listing.save()
    res.redirect(`/listings/${id}`);
    
    
}))

router.delete("/:id/reviews/:reviewid",WrapAsync(async (req,res)=>{
    let {id,reviewid}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviewid}})
    await Review.findByIdAndDelete(reviewid)
    res.redirect(`/listings/${id}`)
}))

module.exports=router;