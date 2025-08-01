const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError");
const {listingSchema, reviewSchema} = require("./schema");
const Review = require("./models/review");
module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.user);
    if (!req.isAuthenticated()) {
        //redirect url
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;  
    }
    next();
}

module.exports.isOwner = async (req, res, next) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);

    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error" ,"You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);

    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
        if(error){
            const msg = error.details.map(el => el.message).join(', ');
            throw new ExpressError(400, msg);
        } else {
            next();
        }
}


module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
        if(error){
            const msg = error.details.map(el => el.message).join(', ');
            throw new ExpressError(400, msg);
        } else {
            next();
        }
}


module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    // if (!review) {
    //     req.flash("error", "Review not found!");
    //     return res.redirect("back");
    // }

    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not authorized to delete this review.");
        return res.redirect(`/listings/${id}`);
    }

    next();
};
