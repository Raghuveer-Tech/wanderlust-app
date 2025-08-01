const Listing = require("../models/listing");
const Review = require("../models/review");

//review create
module.exports.createReview =  async (req, res) => {
  let listing = await Listing.findById(req.params.id)
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  console.log(newReview);
  listing.review.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "New Review Created!");
  res.redirect(`/listings/${listing._id}`);
}

//review delete
module.exports.destroyReview = async (req, res) => {
  const { id, reviewId } = req.params;

  // Remove the review from Listing
  await Listing.findByIdAndUpdate(id, {$pull: {review: reviewId } }
  );

  // reviews are in separate collection
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
}