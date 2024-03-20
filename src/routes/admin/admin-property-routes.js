const express = require("express");
const {
	deserializeUser,
	requiredUser,
	restrictTo,
} = require("../../middleware/deserializeUser");
const { statusValidation } = require("../../validator/admin/admin-validation");
const {
	verifyRealEstate,
	verifyEquipment,
	getAllRealEstate,
	getAllEquipment,
} = require("../../controllers/admin/admin-property-controller");

const router = express.Router();

router.use(express.json());

router.use(deserializeUser);
router.use(requiredUser);
router.use(restrictTo("Admin"));

router.get("/realestate", getAllRealEstate);
router.get("/equipment", getAllEquipment);

router.patch("/realestate", ...statusValidation, verifyRealEstate);
router.patch("/equipment", ...statusValidation, verifyEquipment);

module.exports = router;
