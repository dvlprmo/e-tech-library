const router = require("express").Router();
const passport = require("../config/passportConfig");
const isLoggedIn = require("../config/loginBlocker");
const moment = require("moment");
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


router.get("/auth/aboutus", (request, response) => {
  response.render("auth/aboutus");
});
  
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

  // home page route which it will have all books avaliable
  router.get("/homepage/index", (request, response) => {

    Book.find()
    .then(books => {
        response.render("homepage/index", { books, moment })
    })
    .catch(err => {
        console.log(err);
    });
  })
  
  // homepage route which it will redirect to more information about the book page
  router.get("/homepage/information/:id", (request, response) => {

    Book.findById(request.params.id)
    .then(book => {
        response.render("homepage/information", { book, moment })
    })
    .catch(err => {
        console.log(err);
    });

  })


  
/*
  router.get("/homepage/favorite/:id", (request, response) => {
    Book.findById(request.params.id)
    .then(book => {
      response.render("homepage/favorite", {book, moment})

    }).catch(err => {
      console.log(err)
    })
    
  })
*/
  // directing me to another page called favorite which means 
  // the user add this book to his favorite books list
  router.get("/homepage/bookfav/:id", (request, response) => {
    console.log("user" + request.user._id);
    console.log("book" + request.params.id);
    User.findByIdAndUpdate(request.user._id, { $push: { favoriteBooks: request.params.id}})
    User.findById(request.user._id, "favoriteBooks").populate("favoriteBooks")
    .then( book => {
      let books = book.favoriteBooks
      response.render("homepage/bookfav", { books, moment })
    }).catch(err => {
      console.log(err)
    })
  })



  
   // directing me to another page called readlist page which means 
  //  the user already read that book 
  /*
  router.get("/homepage/readlist/:id", (request, response) => {
    User.findByIdAndUpdate(request.user._id, {$push: {finishReading: request.user._id}})
    User.findById(request.user._id, "finishReading").populate("finishReading")
    .then( booklist => {
      console.log(booklist)
      let readlist = booklist.finishReading
      response.render("homepage/readlist", { readlist, moment })
    }).catch(err => {
      console.log(err)
    })
   
  })
*/

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


// update the password
router.get("/auth/change", (request, response) => {
  response.render("auth/change")
})


// updating the password 

/*
router.post("/auth/change", (request, response) => {
  //let password = new User(request.body);
  let user = new User(request.body);

    user
      .save()
      .then(() => {
        user.password = request.body.password2;
        response.render("auth/messageReset")
      })
      .catch(err => {
        console.log(err);
      });
})
router.get("/auth/message", (request, response) => {
  response.render("auth/messageReset")
})
*/

module.exports = router;