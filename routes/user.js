const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const WrapAsync = require("../public/js/WrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares/isloggedin.js");
const userController = require("../controllers/user.js");

router.route("/signup").get(userController.renderSignupForm)
                       .post(WrapAsync(userController.userSignup))

router.route("/login").get(userController.renderLoginForm)
                      .post(saveRedirectUrl,passport.authenticate('local',{failureRedirect:"/user/login" ,failureFlash:true}),WrapAsync(userController.userLogin))

router.get("/logout",userController.userLogout)

module.exports=router;