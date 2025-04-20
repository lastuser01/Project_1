let Listing=require("../models/Listings.js");
const Review = require("../models/Reviews.js");
let {review_schema}=require("../schema.js");


module.exports.isLoggedIn=(req,res,next)=>{
    if( !req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","Let’s get you checked in — log in!")
        res.redirect("/user/login")
    }
    
        next();
    
}


module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}


module.exports.isAdmin=async(req,res,next)=>{
    let {id}=req.params;
    let listing =await Listing.findById(id);
    if(!listing.admin.equals(res.locals.currUser._id)){
        req.flash("error","You are not owner!")
        res.redirect(`/listings/${id}`)
    }
    next()
}


module.exports.validatereview=(req,res,next)=>{
    let {error}=review_schema.validate(req.body)
    if(error){
        let errmsg=error.details.map((el)=>{el.message}).join(",")
        console.log(error);
        throw new ExpressError(400,errmsg);
    }
    
        next()
    
}


module.exports.isauthor=async (req,res,next)=>{
    let {id,reviewid}=req.params;
    let review=await Review.findById(reviewid);
    if(!review.author.equals(res.locals.currUser)){
        req.flash("error","log in to delete");
        return res.redirect(`/listing/${id}`)
    }
    next()

}