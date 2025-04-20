
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review=require("./Reviews.js")
const user=require("./user.js");
const { string, required } = require("joi");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename:String
  },
  price: Number,
  location: String,
  country: String,
  reviews:[{
    type:Schema.Types.ObjectId,
    ref:"Review"
  }],
  admin:{
    type:Schema.Types.ObjectId,
    ref:"User"
  },
  category:{
    type:[String],
    enum:["Cabin","Arctic","Beachfront","Trending","Rooms","Mountains","Castle","Pools","Camping","boats"],
    required:true
  }
});

listingSchema.post("findOneAndDelete",async (listing)=>{
  if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews}});
  }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

