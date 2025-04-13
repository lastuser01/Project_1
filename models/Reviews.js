const mongoose=require("mongoose");
let {Schema}=mongoose;

let review_schema=new Schema({
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    created_at:{
        type:Date,
        default:new Date()
    }
})

let Review=mongoose.model("Review",review_schema);
module.exports=Review;
