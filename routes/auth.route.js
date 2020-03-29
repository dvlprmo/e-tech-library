const router = require("express").Router();
const passport = require("../config/passportConfig");
const isLoggedIn = require("../config/loginBlocker");
const User = require("../models/user.model");
const List = require("../models/list.model");
const Book = require("../models/book.model")

router.get("/landingpage", (request, response) => {
    response.render("landingpage")
})

router.get("/auth/signup", (request, response) => {
  response.render("auth/signup");
});




// change password and user must be signed in to do
router.get('/auth/change', (req, res) => {
  let password = req.body.password;
  let password2 = req.body.password2;
  xyz = req.body.xyz;
  
  User.findOne({password: req.body.password2}, function(err, user){
   if(err)return handleErr(err);
   user.password = req.body.password2;
   user.save(function(err){
      if(err)return handleErr(err);
      //user has been updated
    });
  });
          //usr.password = password;
          usr.save(function(err, data) {
              if (err)
                  throw err;
              return res.json({ success: true, data: 'password changed successfully' });
          })

      })
  
  
  router.post("/auth/signup", (request, response) => {
    let user = new User(request.body);

    user
      .save()
      .then(() => {
        passport.authenticate("local", {
          successRedirect: "/landingpage", //after login success
          successFlash: "You have logged In!"
        })(request, response);
      })
      .catch(err => {
        console.log(err);
      });
  });

  router.get("/auth/signin", (request, response) => {
    response.render("auth/signin");
  });
  
//   router.get("/dashboard", isLoggedIn, (request, response) => {
//     if (request.user.isSenior) {
//       //get current users list only
//       User.findById(request.user._id, "list")
//         .populate("list")
//         .then(user => {
//           let lists = user.list; //populated list in user model
//           response.render("dashboard/index", { lists });
//         });
//     } else if (request.user.isHelper) {
//       List.find({ status: "free" }).then(lists => {
//         response.render("dashboard/index", { lists });
//       });
//     }
//   });
  
  //-- Login Route
  router.post(
    "/auth/signin",
    passport.authenticate("local", {
      successRedirect: "/landingpage", //after login success
      failureRedirect: "/auth/signin", //if fail
      failureFlash: "Invalid Username or Password",
      successFlash: "You have logged In!"
    })
  );
  
  //--- Logout Route
  router.get("/auth/logout", (request, response) => {
    request.logout(); //clear and break session
    request.flash("success", "Dont leave please come back!");
    response.redirect("/auth/signin");
  });

  // render the reset page
  router.get("/auth/reset", (request, response) => {
    response.render("auth/reset")
  })

  // redirect user to login page if it is not login in
router.use((request, response, next) => {
  if(request.session.user == null){
    response.render("auth/signin")
  }else{
    next()
  }
});

module.exports = router;