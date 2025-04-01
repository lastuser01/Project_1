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

app.use(methodOverride("_method"))
app.use(express.urlencoded({extended:true}))
app.use('/static', express.static(path.join(__dirname, 'public')))
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.engine("ejs",engine);
app.use("/listings",listings);
app.use("/listings/:id/reviews",review)


main().then(()=>{console.log("connected")}).catch(err=>console.log(err))

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');
}

/* -------------middlewares---------------------- */
app.use((err,req,res,next)=>{
    console.log("-----Error----")
    next(err)
})


/* -------------all routes---------------------- */

let checktoken=(req,res,next)=>{
    let {token}=req.query
    if(token==="giveaccess") next();
    else res.send("access denied !!!")
}

app.get("/api",checktoken,(req,res)=>{
  res.send("data sent !!!!!")
})

app.get("/",(req,res)=>{
    res.render("./listing/home.ejs")
})



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