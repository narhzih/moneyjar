const mongoose = require("mongoose");

// Do whatever you want with mongoose
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "You need to provide a name"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: [true, "Please provide a unique email"],
  },
  phone: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  password: String,
  passwordConfirm: String,
});

const User = mongoose.model("User", userSchema);
module.exports = User;
