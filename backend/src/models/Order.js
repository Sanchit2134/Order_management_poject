const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        menuItemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem",
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    customer: {
      name: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
    },
    status: {
      type: String,
      enum: ["Order Received", "Preparing", "Out for Delivery", "Delivered"],
      default: "Order Received",
    },
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
