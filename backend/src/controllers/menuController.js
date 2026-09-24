const MenuItem = require("../models/MenuItem");
const mongoose = require("mongoose");
const AppError = require("../utils/AppError");
const {
  getPaginationParams,
  createPaginationMeta,
} = require("../utils/pagination");

async function listMenu(req, res, next) {
  try {
    const pagination = getPaginationParams(req.query);
    if (!pagination) {
      return res.json(await MenuItem.find());
    }

    const [items, totalItems] = await Promise.all([
      MenuItem.find()
        .sort({ _id: 1 })
        .skip(pagination.skip)
        .limit(pagination.limit),
      MenuItem.countDocuments(),
    ]);

    return res.json({
      items,
      pagination: createPaginationMeta({ ...pagination, totalItems }),
    });
  } catch (error) {
    next(error);
  }
}
async function createMenuItem(req, res, next) {
  try {
    res.status(201).json(await MenuItem.create(req.body));
  } catch (error) {
    next(error);
  }
}
async function deleteMenuItem(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new AppError("Menu item not found", 404, "ITEM_NOT_FOUND");
    }

    const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      throw new AppError("Menu item not found", 404, "ITEM_NOT_FOUND");
    }

    return res.json({ message: "Menu item deleted", id: deletedItem._id });
  } catch (error) {
    next(error);
  }
}
module.exports = { listMenu, createMenuItem, deleteMenuItem };
