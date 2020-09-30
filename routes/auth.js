//////////////////// auth routs////////////////////////

const express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    passport = require("passport");

router.get("/", (req, res) => {
    res.render("landing");
});


router.get("/register", (req, res) => {
    res.render("register");
});

///handel sign up logic

router.post("/register", (req, res) => {
    User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
        if (err) {
            req.flash("error", err.message);
            console.log(err);
            res.redirect("register");
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("Success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//////show login form//////

router.get("/login", (req, res) => {
    res.render("login");
});
/////handling login logic/////
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), (req, res) => {
}
);
/// logout logic route////
router.get("/logout", (req, res) => {
    req.logOut();
    req.flash("success", "You Successfuly Logged Out")
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}
module.exports = router;