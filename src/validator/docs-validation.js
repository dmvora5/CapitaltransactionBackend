const { validateRouteHandler, joiValidation } = require("./validator");
const Joi = require("joi");

// exports.addDrivingLicenceValidation = validateFormData([
// 	body("fullName").exists().withMessage("Please enter fullName!"),
// 	body("customerId").exists().withMessage("Please enter customerId!"),
// 	body("dob").exists().withMessage("Please enter dob!"),
// 	body("gender").exists().withMessage("Please enter gender!"),
// 	body("address").exists().withMessage("Please enter address!"),
// ]);

exports.addDrivingLicenceValidation = joiValidation(
	Joi.object({
		fullName: Joi.string().required().messages({
			"any.required": "fullName is required",
			"string.empty": "fullName cannot be empty",
		}),
		customerId: Joi.string().required().messages({
			"any.required": "customerId is required",
			"string.empty": "customerId cannot be empty",
		}),
		dob: Joi.date().required().messages({
			"any.required": "dob is required",
			"date.base": "dob must be a valid date",
		}),
		gender: Joi.string().required().messages({
			"any.required": "gender is required",
			"string.empty": "gender cannot be empty",
		}),
		address: Joi.string().required().messages({
			"any.required": "address is required",
			"string.empty": "address cannot be empty",
		}),
	})
);
exports.addPassportValidation = joiValidation(
	Joi.object({
		fullName: Joi.string().required().messages({
			"any.required": "fullName is required",
			"string.empty": "fullName cannot be empty",
		}),
		nationality: Joi.string().required().messages({
			"any.required": "nationality is required",
			"string.empty": "nationality cannot be empty",
		}),
		dob: Joi.date().required().messages({
			"any.required": "dob is required",
			"date.base": "dob must be a valid date",
		}),
		gender: Joi.string().required().messages({
			"any.required": "gender is required",
			"string.empty": "gender cannot be empty",
		}),
		passportNo: Joi.string().required().messages({
			"any.required": "passportNo is required",
			"string.empty": "passportNo cannot be empty",
		}),
		country: Joi.string().required().messages({
			"any.required": "country is required",
			"string.empty": "country cannot be empty",
		}),
	})
);

exports.addRealEstateValidation = joiValidation(
	Joi.object({
		fullName: Joi.string().required().messages({
			"any.required": "fullName is required",
			"string.empty": "fullName cannot be empty",
		}),
		location: Joi.string().required().messages({
			"any.required": "location is required",
			"string.empty": "location cannot be empty",
		}),
		address: Joi.string().required().messages({
			"any.required": "address is required",
			"string.empty": "address must be a valid date",
		}),
		propertyAddress: Joi.string().required().messages({
			"any.required": "propertyAddress is required",
			"string.empty": "propertyAddress cannot be empty",
		}),
		email: Joi.string().required().messages({
			"any.required": "email is required",
			"string.empty": "email cannot be empty",
		}),
		phoneNo: Joi.string().required().messages({
			"any.required": "phoneNo is required",
			"string.empty": "phoneNo cannot be empty",
		}),
		cateroryId: Joi.string().required().messages({
			"any.required": "cateroryId is required",
			"string.empty": "cateroryId cannot be empty",
		}),
	})
);

exports.addEquipmentValidation = joiValidation(
	Joi.object({
		vehicalIdetificationNo: Joi.string().required().messages({
			"any.required": "vehicalIdetificationNo is required",
			"string.empty": "vehicalIdetificationNo cannot be empty",
		}),
		titleNo: Joi.string().required().messages({
			"any.required": "titleNo is required",
			"string.empty": "titleNo cannot be empty",
		}),
		year: Joi.date().required().messages({
			"any.required": "year is required",
			"date.base": "year must be a valid date",
		}),
		make: Joi.string().required().messages({
			"any.required": "make is required",
			"string.empty": "make cannot be empty",
		}),
		vehicalBody: Joi.string().required().messages({
			"any.required": "vehicalBody is required",
			"string.empty": "vehicalBody cannot be empty",
		}),
		emptyWGT: Joi.string().required().messages({
			"any.required": "emptyWGT is required",
			"string.empty": "emptyWGT cannot be empty",
		}),
		cateroryId: Joi.string().required().messages({
			"any.required": "cateroryId is required",
			"string.empty": "cateroryId cannot be empty",
		}),
		grossWGT: Joi.string().required().messages({
			"any.required": "grossWGT is required",
			"string.empty": "grossWGT cannot be empty",
		}),
		GVWR: Joi.string().required().messages({
			"any.required": "GVWR is required",
			"string.empty": "GVWR cannot be empty",
		}),
		GCWR: Joi.string().required().messages({
			"any.required": "GCWR is required",
			"string.empty": "GCWR cannot be empty",
		}),
		AXLES: Joi.string().required().messages({
			"any.required": "AXLES is required",
			"string.empty": "AXLES cannot be empty",
		}),
		Fuel: Joi.string().required().messages({
			"any.required": "Fuel is required",
			"string.empty": "Fuel cannot be empty",
		}),
		SalesTaxPaid: Joi.string().required().messages({
			"any.required": "SalesTaxPaid is required",
			"string.empty": "SalesTaxPaid cannot be empty",
		}),
		ODOMeter: Joi.string().required().messages({
			"any.required": "ODOMeter is required",
			"string.empty": "ODOMeter cannot be empty",
		}),
		DateIsuued: Joi.date().required().messages({
			"any.required": "DateIsuued is required",
			"date.base": "DateIsuued cannot be empty",
		}),
		OtherPartinantDate: Joi.date().required().messages({
			"any.required": "OtherPartinantDate is required",
			"date.base": "OtherPartinantDate cannot be empty",
		}),
		OddMeterBrand: Joi.string().required().messages({
			"any.required": "OddMeterBrand is required",
			"string.empty": "OddMeterBrand cannot be empty",
		}),
		PriorTitleNo: Joi.string().required().messages({
			"any.required": "PriorTitleNo is required",
			"string.empty": "PriorTitleNo cannot be empty",
		}),
		fullName: Joi.string().required().messages({
			"any.required": "fullName is required",
			"string.empty": "fullName cannot be empty",
		}),
		address: Joi.string().required().messages({
			"any.required": "address is required",
			"string.empty": "address cannot be empty",
		}),
	})
);

exports.addDigitalIdValidation = validateRouteHandler({
	fullName: {
		in: ["body"],
		exists: { errorMessage: "please enter fullName!" },
	},
	cardNo: {
		in: ["body"],
		exists: { errorMessage: "please enter cardNo!" },
	},
	country: {
		in: ["body"],
		exists: { errorMessage: "please enter country!" },
	},
	phoneNo: {
		in: ["body"],
		exists: { errorMessage: "please enter phoneNo!" },
	},
	email: {
		in: ["body"],
		exists: { errorMessage: "please enter email!" },
	},
	frontImage: {
		in: ["body"],
		exists: { errorMessage: "please enter frontImage!" },
	},
	// backImage: {
	// 	in: ["body"],
	// 	exists: { errorMessage: "please enter backImage!" },
	// },
});
