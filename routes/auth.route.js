const router = require("express").Router();
const passport = require("../config/passportConfig");
const isLoggedIn = require("../config/loginBlocker");
const User = require("../models/user.model");
const List = require("../models/list.model");
const Book = require("../models/book.model")

router.get("/auth/signup", (request, response) => {
    response.render("auth/signup");
  });
  
  router.post("/auth/signup", (request, response) => {
    let user = new User(request.body);
    
    user
      .save()
      .then(() => {
        passport.authenticate("local", {
          successRedirect: "/bookpage", //after login success
          successFlash: "You have logged In!"
        })(request, response);
      })
      .catch(err => {
        console.log(err);
      });
  });


module.exports = router;