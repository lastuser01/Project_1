const express=require("express");
const router=express.Router({mergeParams:true});
const WrapAsync=require("../public/js/WrapAsync");
let Listing=require("../models/Listings.js");
const {isLoggedIn}=require("../middlewares/isloggedin.js")

router.get("/new",isLoggedIn,(req,res)=>{
        res.render("./listing/new.ejs",{})
})

router.get("/",WrapAsync(
    async (req,res)=>{
        let items=await Listing.find({});

        res.render("./listing/index.ejs",{items})
    })
) 

router.get("/search",WrapAsync(
    async (req,res)=>{
        let {value}=req.query;
        let items=await Listing.find({$or:[{location:value},{country:value}]});
        if(items == ""  ){
        req.flash("error","Enter something to search !")
        res.redirect("/listings")
        } 
        else res.render("./listing/index.ejs",{items})
    }))

router.get("/:id",WrapAsync(
    async (req, res, next) => {
        let { id } = req.params;
        let item = await Listing.findById(id).populate("reviews").populate("admin");
        if (!item){
            // res.status(404).send("Listing not found");
            req.flash("error","listing you requested for does not exist !!")
            res.redirect("/listings");
        }
        let length=item.reviews.length;
        res.render("./listing/indivisual.ejs", { item ,length});
    }));


router.post("/",isLoggedIn,WrapAsync(
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
        newlisting.admin=req.user._id;
        await newlisting.save().catch(err=>console.log(err))
        req.flash("success","New listing created !!")
        res.redirect("http://localhost:3000/listings")
    })
) 

router.get("/:id/update",isLoggedIn,WrapAsync(
    async (req,res)=>{
        let {id}=req.params;
        let post=await Listing.findById(id)
       res.render("./listing/update.ejs",{post})
    })
) 

router.patch("/:id",WrapAsync(
    async (req,res)=>{
        let {id}=req.params;
        let listing=req.body.listing;
       await Listing.findByIdAndUpdate(id,listing)
        res.redirect("http://localhost:3000/listings")
    })
) 

router.delete("/:id",isLoggedIn,WrapAsync(
    async (req,res)=>{
        let {id}=req.params;
        await Listing.findByIdAndDelete(id);
        req.flash("error","Listing deleted !!")
        res.redirect("http://localhost:3000/listings")
    })
) 



module.exports=router;