
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review=require("./Reviews.js")
const user=require("./user.js")

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default:
      "https://www.dellaresorts.com/new-images/new-camp-della-exterior-v4.webp",
    set: (v) =>
      v === ""
        ? "https://www.dellaresorts.com/new-images/new-camp-della-exterior-v4.webp"
        : v,
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
  }
});

listingSchema.post("findOneAndDelete",async (listing)=>{
  if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews}});
  }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

