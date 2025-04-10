const express=require("express");
const app=express();
const port=3000;
const mongoose=require("mongoose");
let path=require("path");
let methodOverride=require("method-override")
let engine=require("ejs-mate");
let ExpressError=require("./public/js/ExpressError.js")
let listings=require("./routes/listing.js");
let review=require("./routes/review.js")
let session=require("express-session")
const flash=require("connect-flash");


const sessionOptions={
    resave:false,
    saveUninitialized:true,
    secret:"secretcode",
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}

app.use(flash())
app.use(session(sessionOptions))
app.use(methodOverride("_method"))
app.use(express.urlencoded({extended:true}))
app.use('/static', express.static(path.join(__dirname, 'public')))
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.engine("ejs",engine);


main().then(()=>{console.log("connected")}).catch(err=>console.log(err))

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');
}



app.use((req,res,next)=>{
    res.locals.newlisting=req.flash("newlisting");
    res.locals.newreview=req.flash("newreview");
    res.locals.reviewdeleted=req.flash("reviewdeleted");
    res.locals.deletedlisting=req.flash("deletedlisting")
    res.locals.error=req.flash("error")
    next();
})

app.get("/",(req,res)=>{
    res.render("./listing/home.ejs")
})

app.use("/listings/:id/reviews",review)
app.use("/listings",listings);

app.all("*",(req,res,next)=>{
    next(new ExpressError(500,"no such route found !"))
})

app.use((err,req,res,next)=>{
    let {status=300,message="Something went wrong !!"}=err
    res.render("./listing/err.ejs",{message})
})

app.listen(port,()=>{
    console.log("server started on port 3000")
})