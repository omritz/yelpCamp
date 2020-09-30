const express = require("express"),
      app = express(),
      bodyParse = require("body-parser"),
      mongoose = require("mongoose"),
      seedDB = require("./seeds"),
      User = require("./models/user"),
      passport = require("passport"),
      localStrategy = require("passport-local"),
      campgroundRoutes = require("./routes/campgrounds"),
      commentRoutes = require("./routes/comments"),
      methodOverride = require("method-override"),
      flash = require("connect-flash"),
      authRoutes = require("./routes/auth");



mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParse.urlencoded({extended: true}));
app.set("view engine", "ejs");
//seedDB();   
app.use(methodOverride("_method"));

///////// passport configuriation/////////
app.use(require("express-session")({
    secret: "Web development is not so easy",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    res.locals.error= req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


////useing routs
app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(authRoutes);


app.listen(3000, ()=>{
    console.log("Server has started");
});