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
	addDigitalIdValidation,
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
	createDigitalId,
	getUserDigitalId,
	userUplodedDocument,
	deleteRealEstate,
	deleteEquipment,
} = require("../controllers/userController");
const { validateImage } = require("../validator/imageValidator");

const router = express.Router();

router.use(deserializeUser);
router.use(requiredUser);
router.use(multer().any());

router.get("/dashboard", userDashboard);
router.get("/uploaded-docs", userUplodedDocument);
router.get("/digitalId", getUserDigitalId);
router.get("/driving-licence", getUserLicences);
router.get("/passport", getUserPassport);
router.get("/realestate", getAllUserRealEstate);
router.get("/equipment", getAllUserEquipment);

router.post(
	"/digitalId",
	validateImage,
	...addDigitalIdValidation,
	createDigitalId
);

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

router.delete("/realestate/:id", deleteRealEstate);
router.delete("/equipment/:id", deleteEquipment);

module.exports = router;
