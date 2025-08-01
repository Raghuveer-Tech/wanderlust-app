const mongoose = require("mongoose");
const review = require("./review");

// Define Schema
const listingSchema = new mongoose.Schema({
  title: {
    type: String
  },
  description: String,
  image: {
    url:String,
    filename: String,
  },
  price: {
    type: Number
  },
  location: String,
  country: String,
  review : [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref : "Review",
    }
  ],
  owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref : "User",
  },
  geometry: {
    type: {
      type: String, 
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }

});

const Review = require("./review"); // make sure this matches your model export

listingSchema.post("findOneAndDelete", async function (doc){
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.review } });
  }
});


// Create Model
const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;