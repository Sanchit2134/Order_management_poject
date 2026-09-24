const MenuItem = require("../models/MenuItem");
const Order = require("../models/Order");
const AppError = require("../utils/AppError");

const statuses = [
  "Order Received",
  "Preparing",
  "Out for Delivery",
  "Delivered",
];

async function createOrder({ items, customer }) {
  const menuItems = await Promise.all(
    items.map((item) => MenuItem.findById(item.menuItemId)),
  );
  if (menuItems.some((item) => !item))
    throw new AppError(
      "One or more menu items were not found",
      404,
      "ITEM_NOT_FOUND",
    );
  const orderItems = items.map((item, index) => ({
    menuItemId: menuItems[index]._id,
    name: menuItems[index].name,
    price: menuItems[index].price,
    quantity: item.quantity,
  }));
  const totalPrice = orderItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  return Order.create({ items: orderItems, customer, totalPrice });
}

async function getOrder(id) {
  const order = await Order.findById(id);
  if (!order) throw new AppError("Order not found", 404, "ORDER_NOT_FOUND");
  return order;
}

async function deleteOrder(id) {
  const order = await getOrder(id);
  await order.deleteOne();
}

async function updateStatus(id, status) {
  if (!statuses.includes(status))
    throw new AppError(
      "Invalid order status transition",
      400,
      "INVALID_STATUS_TRANSITION",
    );
  const order = await getOrder(id);
  if (statuses.indexOf(status) < statuses.indexOf(order.status))
    throw new AppError(
      "Order status cannot move backward",
      400,
      "INVALID_STATUS_TRANSITION",
    );
  order.status = status;
  return order.save();
}

async function advanceOrder(id) {
  const order = await getOrder(id);
  const nextStatus = statuses[statuses.indexOf(order.status) + 1];
  return nextStatus ? updateStatus(id, nextStatus) : order;
}

module.exports = {
  createOrder,
  getOrder,
  deleteOrder,
  updateStatus,
  advanceOrder,
  statuses,
};
