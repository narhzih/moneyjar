const jwt = require("jsonwebtoken");
const AppError = require("./../utils/errors/appError");
const User = require("./../models/userModel");
const { promisify } = require("util");
jwt.verify = promisify(jwt.verify);
exports.protect = async (req, res, next) => {
  let token;
  // 1. extract token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    // for in browser requests
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError("You are not logged in", 400));
  }

  try {
    // 2. validate the token
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.id);
    if (!user) {
      return next(
        new AppError(
          "You are not logged in. Please login to access this route",
          401
        )
      );
    }
    if (user.changedPasswordAfter(decodedToken.iat)) {
      return next(new AppError("Token has expired. Please login again", 401));
    }
    req.user = user;
    next();
  } catch (err) {
    return next(err);
  }
};
exports.resetricTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have enough rights to access this route", 401)
      );
    }
    next();
  };
};
