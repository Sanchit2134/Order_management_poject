const router = require("express").Router();
const {
	listMenu,
	createMenuItem,
	deleteMenuItem,
} = require("../controllers/menuController");
const { validateMenuItem } = require("../middleware/validate");
router.get("/", listMenu);
router.post("/", validateMenuItem, createMenuItem);
router.delete("/:id", deleteMenuItem);
module.exports = router;
