const router = require("express").Router();
const passport = require("../config/passportConfig");
const isLoggedIn = require("../config/loginBlocker");
const User = require("../models/user.model");
const Category = require("../models/category.model");
const Book = require("../models/book.model");
var formidable = require('formidable');
const methodOverride = require("method-override");
var fs = require('fs');

router.use(methodOverride("_method"));

router.get("/landingpage", (request, response) => {
    response.render("landingpage")
})

router.get("/auth/signup", (request, response) => {
  response.render("auth/signup");
});




// change password and user must be signed in to do
router.post('/auth/change', (req, res) => {
  const {password, password2 } = req.body;
  let errors = [];

  //check required fields
  if (!password || !password2) {
    errors.push({ msg: 'Please fill in all fields' });
  }

  //check passwords match
  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  //check pass length
  if (password.length < 6) {
    errors.push({ msg: 'Password should be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('update', {
      errors,
      password,
      password2
    })
  }else {
    //validation passed
    User.updateOne({ password: password })
      .then(user => {
        if (user) {
          //user exists
         
          res.render('update', {
            password,
            password2
          });
        } else {
          const updateUser = new User({
            password
          });

      }})}
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

  // homepage route which it will redirect to more information about the book page
  router.get("/dashboard/moreInfo", (request, response) => {
    response.render("homepage/information")
  })

// ======================= Admin Pages =========================

router.get("/category", (request, response) => {
  Category.find()
    .then(categories => {
      response.render("adminPages/addCategory", { categories })
    })
    .catch(err => {
      console.log(err);
    });
});

router.post("/addcategory", (request, response) => {

  let category = new Category(request.body);
  category
    .save()
    .then(() => {
      request.flash("success", "New Category Added Successfully");
      response.redirect("/category");
      })
    .catch(err => {
      response.send("There's an error with adding the category.");
    });
        }
);

router.delete("/category/:id/delete", (request, response) => {
  Category.findByIdAndDelete(request.params.id).then(category => {
    request.flash("success", "Category Deleted Successfully");
    response.redirect("/category");
  });
});

router.put('/category/:id', (req, res) => {
  console.log(req.body);
  console.log(req.params.id);
  Category.findByIdAndUpdate(req.params.id, req.body, (err, updatedModel) => {
    request.flash("success", "Category updated Successfully");
    res.redirect('/category');
  });
});

router.get("/addbook", (request, response) => {

  Category.find()
      .then(categories => {
        response.render("adminPages/addbook", { categories })
      })
      .catch(err => {
        console.log(err);
      });
});

router.post("/addbook", (request, response) => {
  var form = new formidable.IncomingForm();
  form.parse(request, function (err, fields, files) {
    var oldPath = files.filetoupload.path;
    var imagePath = '/dbimg/' + files.filetoupload.name; //display image in our index.ejs file
    var uploadPath = './public/dbimg/' + files.filetoupload.name;

    fs.rename(oldPath, uploadPath, function (err) {
      if (err) throw err;
      else {
        fields.image = imagePath;
        let book = new Book(fields);
        book
          .save()
          .then(() => {
            let category = fields.category;
            Category.findById(category, (err, category) => {
              category.book.push(book);
              category.save();
              });
              // I SHOULD ADD THE USER TOO
            request.flash("success", "New Book added Successfully");
            response.redirect("/addbook");
          })
          .catch(err => {
            console.log(err);
            response.send("There's an error with adding the book.")
          })
      }
    });
  });
});


module.exports = router;