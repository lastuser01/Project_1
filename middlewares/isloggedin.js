module.exports.isLoggedIn=(req,res,next)=>{
    if( !req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","Let’s get you checked in — log in!")
        res.redirect("/user/login")
    }
    else{
        next();
    }
}


module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}