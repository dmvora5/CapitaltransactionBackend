const express = require("express");
const {
	deserializeUser,
	requiredUser,
} = require("../middleware/deserializeUser");
const { idValidation } = require("../validator/category-validation");
const {
	getRealEstate,
	getEquipment,
} = require("../controllers/property-controller");

const router = express.Router();

router.use(express.json());

router.use(deserializeUser);
router.use(requiredUser);

router.get("/equipment/:id", ...idValidation, getEquipment);
router.get("/realestate/:id", ...idValidation, getRealEstate);

module.exports = router;
