const mongoose = require("mongoose");

const categoryScheme = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    icon: {
        type: String
    },
    color: {
        type: String
    }
});

exports.Category = mongoose.model("categories", categoryScheme);
