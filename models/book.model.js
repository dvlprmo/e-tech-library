const mongoose = require("mongoose");
const bookSchema = mongoose.Schema(
  {
    title: {type: String,  
            required: true
    },
    description: { type: String, 
                    required: true

    },
    publisher: {type: String,  
                required: true
    }, 
    link: { type: String,  
            required: true
    },
    ISBN: { type: String,  
             required: true
    },
    numberOfPage: {type: String,  
                    required: true
    },
    user: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  { timestamps: true } //means createdAt and updatedAt
);
const Book = mongoose.model("Book", bookSchema);
//export to be used on other pages
module.exports = Book;