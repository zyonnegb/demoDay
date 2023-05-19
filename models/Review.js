const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  productName: {
    type: String,
  },
  productSize: {
    type: String,
  },
  productReview: {
    type: String,
  },
  productLink: {
    type: String,
  },
  key: {
    type: String,
  },
  rating: {
    type: String,
  },
  user: {
    type: String,
    ref: "User",
  },
  userEmail: {
    type: String,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
    require: true,
  },
  cloudinaryId: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Review", ReviewSchema);
