const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken:mapToken });

//index route
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
};

//new form render
module.exports.renderNewForm =  (req, res) => {
    res.render("./listings/new.ejs");
}

//show listing
module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({ path: "review",populate: { path: "author" }}).populate("owner");

    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("./listings/show.ejs", {listing});
}

//create listing
module.exports.createListing = async(req, res, next) => {
       let response = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
        })
        .send();

        let url = req.file.path;
        let filename = req.file.filename;
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = {url, filename};

        let saveListing =  newListing.geometry = response.body.features[0].geometry;

        await newListing.save();
        console.log(saveListing);

        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
    }

//edit form render
module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);

    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    let originalUrl = listing.image.url;
    originalUrl.replace("/upload", "/upload/w_250");
    res.render("./listings/edit.ejs", {listing, originalUrl});
}   

//update listing
module.exports.updateListing = async (req, res) => {  
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    const listing = await Listing.findById(id);
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}

//delete route 
module.exports.destroyListing = async (req,res) =>{
    let {id} = req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
   console.log(deletedList);
   console.log("Delete successfully")
   req.flash("success", " Listing Deleted!");
   res.redirect("/listings");
}