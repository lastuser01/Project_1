const Listing = require("../models/Listings");
const Review = require("../models/Reviews");



module.exports.createReview=async(req,res)=>{
    let{ id}=req.params;
    let listing=await Listing.findById(id);
    let new_review=new Review(req.body.review);

    new_review.author=req.user._id;
    listing.reviews.push(new_review)

    await new_review.save()
    await listing.save()

    req.flash("success","Review created !!")
    res.redirect(`/listings/${id}`);
}


module.exports.deleteReview=async (req,res)=>{
    let {id,reviewid}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviewid}})
    await Review.findByIdAndDelete(reviewid)
    req.flash("error","Review deleted  !! ")
    res.redirect(`/listings/${id}`)
}