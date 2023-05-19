const mongoose = require("mongoose");

const KeySchema = new mongoose.Schema({
  feet: {
    type: Number,
    required: true,
  },
  inches: {
    type: Number,
    require: true,
  },
  lbs: {
    type: Number,
    require: true,
  },
  key: {
    type: String,
    require: true,
  },
  userEmail: {
    type: String,
    ref: "User",
  },
  user: {
    type: String,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Key", KeySchema);
