const express = require("express");
const {
	deserializeUser,
	requiredUser,
} = require("../middleware/deserializeUser");
const {
	getUserNotifications,
	updateViewStatusOfNotification,
} = require("../controllers/userController");
const {
	validateUpdateNotficationStatus,
} = require("../validator/user-validation");

const router = express.Router();

router.use(express.json());

router.use(deserializeUser);
router.use(requiredUser);

router.get("/", getUserNotifications);
router.patch("/", updateViewStatusOfNotification);

module.exports = router;
