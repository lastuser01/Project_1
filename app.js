const express=require("express");
const app=express();
const port=3000;
const mongoose=require("mongoose");
let Listing=require("./models/Listings.js");
let path=require("path");
let methodOverride=require("method-override")
let engine=require("ejs-mate");
let ExpressError=require("./public/js/ExpressError.js")
let WrapAsync=require("./public/js/WrapAsync.js")

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

/* -------------middlewares---------------------- */

app.use((req,res,next)=>{
    
    next();
})



app.get("/err",(req,res,next)=>{
    next()
})
app.use((err,req,res,next)=>{
    console.log("-----Error----")
    next(err)
})
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

app.get("/listings/new",(req,res)=>{
    res.render("./listing/new.ejs",{})
})

app.get("/listings",WrapAsync(
    async (req,res)=>{
        let items=await Listing.find({});
        res.render("./listing/index.ejs",{items})
    })
) 


app.get("/listings/:id",WrapAsync(
    async (req, res, next) => {
        let { id } = req.params;
        let item = await Listing.findById(id);
        if (!item) return res.status(404).send("Listing not found");
        res.render("./listing/indivisual.ejs", { item });
    }));


app.post("/listings",WrapAsync(
    async (req,res)=>{
        /*
        let {title,description,image,price,location,country}=req.body;
        let article ={title:title,
                description:description,
                image:image,
                price:price,
                location:location,
                country:country
                await Listing.insertOne(article)
        }
                */
        const listing=req.body.listing;
        let newlisting = new Listing(listing)
        newlisting.save().then(res=>console.log(res)).catch(err=>console.log(err))
        res.redirect("http://localhost:3000/listings")
    })
) 

app.post("/listings/search",WrapAsync(
    async (req,res)=>{
        let search=req.body.search
        let items=await Listing.find({$or:[{location:search},{country:search}]});
      
        if(items == ""  ){
        console.log(items)
        res.render("./listing/err.ejs",{message:"no result found!!"})
        } 
        else res.render("./listing/index.ejs",{items})
    }))

app.get("/listings/:id/update",WrapAsync(
    async (req,res)=>{
        let {id}=req.params;
        let post=await Listing.findById(id)
       res.render("./listing/update.ejs",{post})
    })
) 

app.patch("/listings/:id",WrapAsync(
    async (req,res)=>{
        let {id}=req.params;
        let listing=req.body.listing;
        let post=await Listing.findByIdAndUpdate(id,listing)
        res.redirect("http://localhost:3000/listings")
    })
) 

app.delete("/listings/:id",WrapAsync(
    async (req,res)=>{
        let {id}=req.params;
        let remove=await Listing.findByIdAndDelete(id);
        res.redirect("http://localhost:3000/listings")
    })
) 
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