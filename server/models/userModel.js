const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const crypto = require("crypto");

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
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  phone: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordTokenExpiresAt: Date,
});

// Hash password anytime it is modified
userSchema.pre("save", async function (next) {
  // skip for already existing documents
  if (!this.isModified("password")) return next();

  // Hash password before saving.
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.confirmPassword = async function (
  inputPassword,
  userPassword
) {
  return await bcrypt.compare(inputPassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash the token before saving
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordTokenExpiresAt = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
