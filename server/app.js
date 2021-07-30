const express = require("express");
const app = express();
const globalErrorHandler = require("./utils/errors/globalErrorHandler");
const AppError = require("./utils/errors/appError");
const authRoutes = require("./routes/authRoutes");

app.use(express.json());

app.get("/", (req, res) => {
  res.status(201).json({
    status: "success",
    message: "Hitting all possible routes",
  });
});
app.use("/api/auth", authRoutes);

app.get("*", (req, res, next) => {
  return next(new AppError(`Can't find ${req.originalUrl} on this server`));
});

app.use(globalErrorHandler);

module.exports = app;
