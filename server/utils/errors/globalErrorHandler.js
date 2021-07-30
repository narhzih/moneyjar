const sendErrorDev = (err, req, res) => {
  console.error("ERROR 💥", err);
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = () => {};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    return sendErrorDev(err, req, res);
  }

  if (process.env.NODE_ENV === "production") {
    // Send production error
  }
};
