function errorHandler(error, req, res, _next) {
  // eslint-disable-line no-unused-vars
  if (error.name === "CastError") {
    return res
      .status(404)
      .json({ error: { message: "Order not found", code: "ORDER_NOT_FOUND" } });
  }
  const statusCode = error.statusCode || 500;
  return res
    .status(statusCode)
    .json({
      error: {
        message: error.message || "Something went wrong",
        code: error.code || "INTERNAL_ERROR",
      },
    });
}

module.exports = errorHandler;
