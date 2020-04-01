const express = require("express");
const mongoose = require("mongoose");
const server = express();
require("dotenv").config();
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("./config/passportConfig");
const expressLayouts = require("express-ejs-layouts");
const authRoutes = require("./routes/auth.route");
const MongoStore = require('connect-mongo')(session);
// connecting database with the server
mongoose.connect(
    process.env.MONGODB,

    {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    () => console.log("Mongo connected ...")
);

server.use(express.static("public"));
server.use(express.urlencoded({extended: true}));
server.set("view engine", "ejs");
server.use(expressLayouts)

// below must be placed in correct way:
server.use(
    session({
      secret: process.env.SECRET,
      saveUninitialized: true,
      resave: false,
      cookie: { maxAge: 360000 },
      store: new MongoStore({ url: process.env.MONGODB })
    })
  );


  
// passport
server.use(passport.initialize());
server.use(passport.session());
server.use(flash());


server.use(function(request, response, next) {
    // before every route, attach the flash messages and current user to res.locals
    response.locals.alerts = request.flash();
    response.locals.currentUser = request.user;
    next();
  });

  server.use(authRoutes);


  // errors when no downloaded page in there
  server.get("*", (req, res) => {
    res.send("does not exist");
  });
  

  // listen 
  server.listen(process.env.PORT, () =>
    console.log(`connected to express on ${process.env.PORT}`)
  );


