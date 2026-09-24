const { advanceOrder } = require("./orderService");

function scheduleStatusUpdates(
  orderId,
  intervalMs = Number(process.env.STATUS_ADVANCE_INTERVAL_MS) || 15000,
) {
  const timer = setInterval(async () => {
    try {
      const order = await advanceOrder(orderId);
      if (order.status === "Delivered") clearInterval(timer);
    } catch (error) {
      clearInterval(timer);
    }
  }, intervalMs);
  return timer;
}

module.exports = { scheduleStatusUpdates };
