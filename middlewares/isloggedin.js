module.exports.isLoggedIn=(req,res,next)=>{
    if( !req.isAuthenticated()){
        res.redirect("/user/login")
    }
    else{
        next();
    }
}