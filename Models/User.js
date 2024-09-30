const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  productId: String,
  variantId: String,
  status: String,
  LemonSqueezyCreatedAt: Date,
  productName: String,
  variantName: String,
  eventName: String,
  trials: Number
});

const User = mongoose.model("User", userSchema);
module.exports = User;
