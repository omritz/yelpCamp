//all the middleware goes here
const   Campground = require("../models/campground"),
        Comment = require("../models/comment"),
        middlewareObj = {};


middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please Login First")
    res.redirect("/login");
}

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, campground) => {
            if (err) {
                req.flash("error", "Campground Not Found");
                res.redirect("back");
            } else {
                if (!campground) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
                if (campground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You Dont Have Premission To Do That!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You Need To Be Logeed In To Do That");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, comment) => {
            if (err) {
                req.flash("error", "Comment Not Found");
                res.redirect("back");
            } else {
                if (!comment) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
                if (comment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You Dont Have Premission To Do That");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You Need To Be Logeed In To Do That");
        res.redirect("back");
    }
}

middlewareObj.checkUserCampground =  function(req, res, next) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err || !foundCampground) {
            console.log(err);
            req.flash('error', 'Sorry, that campground does not exist!');
            res.redirect('/campgrounds');
        } else if (foundCampground.author.id.equals(req.user._id) || req.user.isAdmin) {
            req.campground = foundCampground;
            next();
        } else {
            req.flash('error', 'You dont have permission to do that!');
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
}

middlewareObj.checkUserComment = function(req, res, next) {
    Comment.findById(req.params.commentId, function (err, foundComment) {
        if (err || !foundComment) {
            console.log(err);
            req.flash('error', 'Sorry, that comment does not exist!');
            res.redirect('/campgrounds');
        } else if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
            req.comment = foundComment;
            next();
        } else {
            req.flash('error', 'You dont have permission to do that!');
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
}

module.exports = middlewareObj;