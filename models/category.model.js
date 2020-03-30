const mongoose = require("mongoose");

var categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        book: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book"
        }],
    },      
    
    { timestamps: true }
);

const Category = mongoose.model("List", categorySchema);
module.exports = Category;
