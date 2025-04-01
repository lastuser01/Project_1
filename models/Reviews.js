const mongoose=require("mongoose");
let {Schema}=mongoose;

let review_schema=new Schema({
    username:String,
    comment:String,
    rating:{
        type:String,
        min:1,
        max:5
    },
    created_at:{
        type:Date,
        defalut:new Date()
    }
})

let Review=mongoose.model("Review",review_schema);
module.exports=Review;
