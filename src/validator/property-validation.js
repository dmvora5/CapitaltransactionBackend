const { validateRouteHandler } = require("./validator");

exports.addRealEstateValidation = validateRouteHandler({
	fullName: {
		in: ["body"],
		exists: { errorMessage: "please enter fullName!" },
	},
	location: {
		in: ["body"],
		exists: { errorMessage: "please enter location!" },
	},
	address: {
		in: ["body"],
		exists: { errorMessage: "please enter address!" },
	},
	propertyAddress: {
		in: ["body"],
		exists: { errorMessage: "please enter propertyAddress!" },
	},
	email: {
		in: ["body"],
		exists: { errorMessage: "please enter email!" },
	},
	phoneNo: {
		in: ["body"],
		exists: { errorMessage: "please enter phoneNo!" },
	},
	cateroryId: {
		in: ["body"],
		exists: { errorMessage: "please enter cateroryId!" },
	},
});

exports.addEquipmentValidation = validateRouteHandler({
	vehicalIdetificationNo: {
		in: ["body"],
		exists: { errorMessage: "please enter vehicalIdetificationNo!" },
	},
	titleNo: {
		in: ["body"],
		exists: { errorMessage: "please enter titleNo!" },
	},
	year: {
		in: ["body"],
		exists: { errorMessage: "please enter year!" },
	},
	make: {
		in: ["body"],
		exists: { errorMessage: "please enter make!" },
	},
	vehicalBody: {
		in: ["body"],
		exists: { errorMessage: "please enter vehicalBody!" },
	},
	emptyWGT: {
		in: ["body"],
		exists: { errorMessage: "please enter emptyWGT!" },
	},
	grossWGT: {
		in: ["body"],
		exists: { errorMessage: "please enter grossWGT!" },
	},
	GVWR: {
		in: ["body"],
		exists: { errorMessage: "please enter GVWR!" },
	},
	GCWR: {
		in: ["body"],
		exists: { errorMessage: "please enter GCWR!" },
	},
	AXLES: {
		in: ["body"],
		exists: { errorMessage: "please enter AXLES!" },
	},
	Fuel: {
		in: ["body"],
		exists: { errorMessage: "please enter Fuel!" },
	},
	SalesTaxPaid: {
		in: ["body"],
		exists: { errorMessage: "please enter SalesTaxPaid!" },
	},
	ODOMeter: {
		in: ["body"],
		exists: { errorMessage: "please enter ODOMeter!" },
	},
	DateIsuued: {
		in: ["body"],
		exists: { errorMessage: "please enter DateIsuued!" },
	},
	OtherPartinantDate: {
		in: ["body"],
		exists: { errorMessage: "please enter OtherPartinantDate!" },
	},
	OddMeterBrand: {
		in: ["body"],
		exists: { errorMessage: "please enter OddMeterBrand!" },
	},
	PriorTitleNo: {
		in: ["body"],
		exists: { errorMessage: "please enter PriorTitleNo!" },
	},
	fullName: {
		in: ["body"],
		exists: { errorMessage: "please enter fullName!" },
	},
	address: {
		in: ["body"],
		exists: { errorMessage: "please enter address!" },
	},
	cateroryId: {
		in: ["body"],
		exists: { errorMessage: "please enter cateroryId!" },
	},
});
