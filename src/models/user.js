const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  name: String,
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: String,
  country: String,
  otp: String, // Assuming OTP is stored in the user document for email validation
});

const User = mongoose.model("User", userSchema);

module.exports = User;
