const AppError = require("../utils/AppError");

function validateMenuItem(req, res, next) {
  const { name, description, price, imageUrl } = req.body;
  if (
    !name ||
    !description ||
    !imageUrl ||
    typeof price !== "number" ||
    price <= 0
  ) {
    return next(
      new AppError(
        "Name, description, positive price and imageUrl are required",
        400,
        "VALIDATION_ERROR",
      ),
    );
  }
  return next();
}

function validateOrder(req, res, next) {
  const { items, customer } = req.body;
  const validCustomer =
    customer && customer.name && customer.address && customer.phone;
  const validItems =
    Array.isArray(items) &&
    items.length > 0 &&
    items.every(
      (item) =>
        item.menuItemId &&
        Number.isInteger(item.quantity) &&
        item.quantity >= 1,
    );
  if (!validCustomer || !validItems)
    return next(
      new AppError(
        "A non-empty items list and customer name, address and phone are required",
        400,
        "VALIDATION_ERROR",
      ),
    );
  return next();
}

module.exports = { validateMenuItem, validateOrder };
