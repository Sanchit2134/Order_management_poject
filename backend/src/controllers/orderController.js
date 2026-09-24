const Order = require("../models/Order");
const {
  createOrder,
  getOrder,
  deleteOrder,
  updateStatus,
} = require("../services/orderService");
const { scheduleStatusUpdates } = require("../services/statusSimulator");

async function listOrders(req, res, next) {
  try {
    res.json(await Order.find().sort({ createdAt: -1 }));
  } catch (error) {
    next(error);
  }
}
async function create(req, res, next) {
  try {
    const order = await createOrder(req.body);
    scheduleStatusUpdates(order._id);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
}
async function get(req, res, next) {
  try {
    res.json(await getOrder(req.params.id));
  } catch (error) {
    next(error);
  }
}
async function remove(req, res, next) {
  try {
    await deleteOrder(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
async function status(req, res, next) {
  try {
    res.json(await updateStatus(req.params.id, req.body.status));
  } catch (error) {
    next(error);
  }
}
module.exports = { listOrders, create, get, remove, status };
