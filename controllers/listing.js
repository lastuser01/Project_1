const Listing = require("../models/Listings");
const cloudinary = require('cloudinary').v2;

module.exports.index=async (req,res)=>{
    let items=await Listing.find({});
    res.render("./listing/index.ejs",{items})
}

module.exports.rendernewForm=(req,res)=>{
    res.render("./listing/new.ejs",{})
}

module.exports.renderSearchForm= async (req,res)=>{
    let {value}=req.query;
    let items=await Listing.find({$or:[{location:value},{country:value}]});
    if(items == ""  ){
    req.flash("error","Try exploring different locations or relaxing your filters. !")
    res.redirect("/listings")
    } 
    else res.render("./listing/index.ejs",{items})
}

module.exports.renderIndivisualListing=async (req, res, next) => {
    let { id } = req.params;
    let item = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("admin");
    if (!item){
        req.flash("error","listing you requested for does not exist !!")
        return res.redirect("/listings");
    }
    else{
        let length=item.reviews.length;
        res.render("./listing/indivisual.ejs", { item ,length});
    }
}


module.exports.createListing=async (req,res)=>{
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
           
    let url=req.file.path;
    let filename=req.file.filename
    const listing=req.body.listing;
    let newlisting = new Listing(listing)
    console.log(req.body.listing)
    newlisting.admin=req.user._id;
    newlisting.image={url,filename}
    await newlisting.save().catch(err=>console.log(err))
    req.flash("success","New listing created !!")
    res.redirect("/listings")
}


module.exports.renderUpdateForm=async (req,res)=>{
    let {id}=req.params;
    let post=await Listing.findById(id)
    let originalImage=post.image.url
    originalImage=originalImage.replace("/upload","/upload/w_250");
   res.render("./listing/update.ejs",{post,originalImage})
}

module.exports.renderBookingForm=(req,res)=>{
    res.render("./listing/BookingForm.ejs",{})
}


module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
   let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing})
   console.log(listing)
   if(typeof req.file !=="undefined"){
       console.log(req.file)
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename}
        await listing.save()
    }
    req.flash("success","Listing updated!!")
    res.redirect("/listings")
}


module.exports.applyFilter=async (req,res)=>{
        let {categories}=req.body;
         
        if(!categories || !categories.length){
            return res.status(400).json({ 
                success: false,
                error: "Categories must be provided as an array"
              });
        }

        const filteredListings = await Listing.find({ category: { $in: categories } });

        res.json({
            success: true,
            items: filteredListings
        })
      
}

module.exports.deleteListing=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id)
    if (listing.image.filename) {
        await cloudinary.uploader.destroy(listing.image.filename);
      }
    await Listing.findByIdAndDelete(id);
    req.flash("error","Listing deleted !!")
    res.redirect("/listings")
}