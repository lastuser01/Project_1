const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const WrapAsync = require("../public/js/WrapAsync");
const passport = require("passport");

router.get("/signup",(req,res)=>{
    res.render("./users/signup.ejs",{})
})

router.post("/signup",WrapAsync(async (req,res)=>{
    try{
        let {email,password,username}=req.body;
        let newuser=new User({email,username})
        let registeruser=await User.register(newuser,password);
        console.log(registeruser);
        req.flash("success"," Welcome to a world where every stay feels like a dream !!")
        res.redirect("/");
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/user/signup");
    }
}))

router.get("/login",(req,res)=>{
    res.render("./users/login.ejs",{})
})

router.post("/login",passport.authenticate('local',{failureRedirect:"/user/login" ,failureFlash:true}),WrapAsync(async (req,res)=>{
        req.flash("success","logged in !!")
        res.redirect("/");
    
}))

module.exports=router;