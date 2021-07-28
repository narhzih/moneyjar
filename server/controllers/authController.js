const AppError = require("../utils/errors/appError");

exports.login = async (req, res, next) => {
  res.status(201).json({
    status: "success",
    message: "Login successful",
  });
};

exports.register = async (req, res, next) => {
  res.status(201).json({
    status: "success",
    message: "Registeration on the way",
  });
};
