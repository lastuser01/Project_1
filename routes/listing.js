const express=require("express");
const router=express.Router();
const WrapAsync=require("../public/js/WrapAsync");
let Listing=require("../models/Listings.js");

router.get("/new",(req,res)=>{
    res.render("./listing/new.ejs",{})
})

router.get("/",WrapAsync(
    async (req,res)=>{
        let items=await Listing.find({});

        res.render("./listing/index.ejs",{items})
    })
) 


router.get("/:id",WrapAsync(
    async (req, res, next) => {
        let { id } = req.params;
        let item = await Listing.findById(id).populate("reviews");
        if (!item) return res.status(404).send("Listing not found");
        let length=item.reviews.length;
        res.render("./listing/indivisual.ejs", { item ,length});
    }));


router.post("/",WrapAsync(
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
        await newlisting.save().catch(err=>console.log(err))
        req.flash("newlisting","new listing created!")
        res.redirect("http://localhost:3000/listings")
    })
) 

router.post("/search",WrapAsync(
    async (req,res)=>{
        let search=req.body.search
        let items=await Listing.find({$or:[{location:search},{country:search}]});
        if(items == ""  ){
        res.render("./listing/err.ejs",{message:"no result found!!"})
        } 
        else res.render("./listing/index.ejs",{items})
    }))

router.get("/:id/update",WrapAsync(
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

router.delete("/:id",WrapAsync(
    async (req,res)=>{
        let {id}=req.params;
        await Listing.findByIdAndDelete(id);
        res.redirect("http://localhost:3000/listings")
    })
) 



module.exports=router;