const router = require("express").Router();
const controller = require("../controllers/orderController");
const { validateOrder } = require("../middleware/validate");
router.get("/", controller.listOrders);
router.post("/", validateOrder, controller.create);
router.get("/:id", controller.get);
router.delete("/:id", controller.remove);
router.patch("/:id/status", controller.status);
module.exports = router;
