const express = require("express");
const {
	deserializeUser,
	requiredUser,
} = require("../middleware/deserializeUser");
const {
	onSellEquipmentValidation,
	onSellPropertyValidation,
} = require("../validator/marketpace-validatior");
const {
	launchEquipmentOnMarket,
	launchRealEstateOnMarket,
	getAllEquipmentOnMarketPlace,
	getAllPropertyMarketPlace,
	getEquipmentMarketPlace,
	gePropertyMarketPlace,
} = require("../controllers/marketplace-Controller");

const router = express.Router();

router.use(express.json());

router.use(deserializeUser);
router.use(requiredUser);

router.get("/equipment", getAllEquipmentOnMarketPlace);
router.get("/realestate", getAllPropertyMarketPlace);

router.get("/equipment/:id", getEquipmentMarketPlace);
router.get("/realestate/:id", gePropertyMarketPlace);

router.post(
	"/equipment",
	...onSellEquipmentValidation,
	launchEquipmentOnMarket
);
router.post(
	"/realestate",
	...onSellPropertyValidation,
	launchRealEstateOnMarket
);

module.exports = router;
