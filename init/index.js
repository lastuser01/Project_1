const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/Listings.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
 initData.data=initData.data.map((obj)=>({...obj,admin:"67f97e214c1f898ccfce1f58"}))
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();