const mongoose = require("mongoose");

var listSchema = new mongoose.Schema(
    {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        favoriteBooks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Book"
            }
        ],
        finishReading: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Book"
            }],    
    },
    
    { timestamps: true }
);

const List = mongoose.model("List", listSchema);
module.exports = List;
