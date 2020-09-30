const   express = require("express"),
        router = express.Router(),
        Campground = require("../models/campground"),
        middleware = require("../middleware/index");

router.get("/campgrounds", (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds });
        }

    });

});

router.post("/campgrounds", middleware.isLoggedIn, (req, res) => {
    var name = req.body.name;
    var img = req.body.image;
    var description = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = { name: name, image: img, description: description, price: price, author: author};
    Campground.create(newCampground,
        (err, campground) => {
            if (err) {
                console.log(err);
            } else {
                console.log("NEWLY CREATED CAMPGROUND");
                console.log(campground);
            }
        });
    res.redirect("/campgrounds");
});

router.get("/campgrounds/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

router.get("/campgrounds/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, campground) => {
        if (err || !campground) {
            console.log(err);
            req.flash("error", "Sorry this campground does not exist");
            return res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/show", { campground });
        }
    });
});

///edit route
router.get("/campgrounds/:id/edit", middleware.isLoggedIn, middleware.checkUserCampground, (req ,res)=>{
        res.render("campgrounds/edit", { campground: req.campground });
});

//update route
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, (req, res)=>{
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updated)=>{
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds/" + req.params.id);
        }

    });
});

router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, (req , res) =>{
    Campground.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds");
        }
    });
});


module.exports = router;