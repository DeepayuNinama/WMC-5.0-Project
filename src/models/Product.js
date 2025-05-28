const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    imageurl: {
        type: String,
        required: true,
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    date: {
        type: Date
    },
    adminApproved: {
        type: Boolean,
        default: false,
    },
    weight: {
        type: String
    },
    seats: {
        type: String
    },
    features: {
        type: String
    },
    usecasescenario: {
        trye: String
    }
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
