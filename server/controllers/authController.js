const AppError = require("../utils/errors/appError");
const jwt = require("jsonwebtoken");
const util = require("util");
const crypto = require("crypto");
const User = require("../models/userModel");
const Mail = require("./../utils/mail");
jwt.verify = util.promisify(jwt.verify);

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  // res.cookie("jwt", token, cookieOptions);

  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide a valid email and password"));
  }

  try {
    const user = await User.findOne({ email }).select("+password");
    const passwordIsCorrect = await user.confirmPassword(
      password,
      user.password
    );
    if (!user || passwordIsCorrect === false) {
      return next(new AppError("Incorrect email and password combination"));
    }

    createSendToken(user, 201, res);
  } catch (err) {
    return next(err);
  }
};

exports.register = async (req, res, next) => {
  try {
    const user = await User.create({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
    createSendToken(user, 201, res);
  } catch (err) {
    return next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("Invalid email provided", 401));
  }

  const resetToken = user.createPasswordResetToken();
  user.save({ validateBeforeSave: false });

  try {
    const mailer = new Mail(user);
    await mailer.sendResetToken(resetToken);
    res.status(200).json({
      status: "success",
      message:
        "Please check your email for instructions on how to reset your password",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordTokenExpiresAt = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("An error occurred when trying to send mail", 500)
    );
  }
};

exports.resetPassword = async (req, res, next) => {
  const token = req.params.resetToken;

  //validate the token received
  const decryptedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  try {
    const user = await User.findOne({
      passwordResetToken: decryptedToken,
      passwordTokenExpiresAt: { $gte: Date.now() },
    });
    if (!user) {
      return next(new AppError("Token has expired", 400));
    }
    // Proceed to validte password

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordTokenExpiresAt = undefined;

    await user.save();
    createSendToken(user, 201, res);
  } catch (err) {
    return next(err);
  }
};
