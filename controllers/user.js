const User= require("../models/user");


module.exports.renderSignupForm=(req,res)=>{
    res.render("./users/signup.ejs",{})
}

module.exports.userSignup=async (req,res)=>{
    try{
        let {email,password,username}=req.body;
        let newuser=new User({email,username})
        let registeruser=await User.register(newuser,password);
        req.login(registeruser,(err)=>{
            if(err){
                next(err)
            }
            req.flash("success"," Welcome to a world where every stay feels like a dream !!")
            res.redirect("/");
        })
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/user/signup");
    }
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("./users/login.ejs",{})
}

module.exports.userLogin=async (req,res)=>{
    req.flash("success","Welcome back, jetsetter! Time to treat yourself to a sweet stay ! 🛬🍹")
    let redirecturl=res.locals.redirectUrl;
    if(redirecturl){
        res.redirect(redirecturl);
    }
    res.redirect("/");
}


module.exports.userLogout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        else{
            req.flash("success","Poof ! You vanished . log back in to reappear 🪄")
            res.redirect("/")
        }
    })
}