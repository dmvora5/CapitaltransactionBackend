const express = require("express");
const multer = require("multer");

const {
	deserializeUser,
	requiredUser,
} = require("../middleware/deserializeUser");

const {
	addDrivingLicenceValidation,
	addPassportValidation,
	addRealEstateValidation,
	addEquipmentValidation,
} = require("../validator/docs-validation");
const {
	createUserDrivingLicence,
	createUserPassport,
	addRealEstate,
	addEquipment,
	userDashboard,
	getUserLicences,
	getUserPassport,
	getAllUserRealEstate,
	getAllUserEquipment,
} = require("../controllers/userController");
const { validateImage } = require("../validator/imageValidator");

const router = express.Router();

router.use(deserializeUser);
router.use(requiredUser);
router.use(multer().any());

router.get("/dashboard", userDashboard);
router.get("/driving-licence", getUserLicences);
router.get("/passport", getUserPassport);
router.get("/realestate", getAllUserRealEstate);
router.get("/equipment", getAllUserEquipment);

router.post(
	"/driving-licence",
	validateImage,
	...addDrivingLicenceValidation,
	createUserDrivingLicence
);

router.post(
	"/passport",
	validateImage,
	...addPassportValidation,
	createUserPassport
);

router.post(
	"/realestate",
	validateImage,
	...addRealEstateValidation,
	addRealEstate
);

router.post(
	"/equipment",
	validateImage,
	...addEquipmentValidation,
	addEquipment
);

module.exports = router;
