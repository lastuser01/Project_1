const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const WrapAsync = require("../public/js/WrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares/isloggedin.js");

router.get("/signup",(req,res)=>{
    res.render("./users/signup.ejs",{})
})

router.post("/signup",WrapAsync(async (req,res)=>{
    try{
        let {email,password,username}=req.body;
        let newuser=new User({email,username})
        let registeruser=await User.register(newuser,password);
        console.log(registeruser);
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
}))

router.get("/login",(req,res)=>{
    res.render("./users/login.ejs",{})
})

router.post("/login",saveRedirectUrl,passport.authenticate('local',{failureRedirect:"/user/login" ,failureFlash:true}),WrapAsync(async (req,res)=>{
        req.flash("success","Welcome back, jetsetter! Time to treat yourself to a sweet stay ! 🛬🍹")
        let redirecturl=res.locals.redirectUrl;
        if(redirecturl){
            res.redirect(redirecturl);
        }
        res.redirect("/");
        
    
}))

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        else{
            req.flash("success","Poof ! You vanished . log back in to reappear 🪄")
            res.redirect("/")
        }
    })
})

module.exports=router;