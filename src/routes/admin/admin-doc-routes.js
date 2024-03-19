const express = require("express");
const { statusValidation } = require("../../validator/admin/admin-validation");
const {
	updateLicenceStatus,
	updatePassportStatus,
	getAllLicence,
	getAllPassport,
	getLicence,
	getPassport,
} = require("../../controllers/admin/admin-docs-controller");
const { idValidation } = require("../../validator/category-validation");
const {
	deserializeUser,
	requiredUser,
	restrictTo,
} = require("../../middleware/deserializeUser");

const router = express.Router();

router.use(express.json());

router.use(deserializeUser);
router.use(requiredUser);
router.use(restrictTo("Admin"));

router.get("/licence", getAllLicence);
router.get("/licence/:id", ...idValidation, getLicence);
router.patch("/licence", ...statusValidation, updateLicenceStatus);

router.get("/passport", getAllPassport);
router.get("/passport/:id", ...idValidation, getPassport);
router.patch("/passport", ...statusValidation, updatePassportStatus);

module.exports = router;
