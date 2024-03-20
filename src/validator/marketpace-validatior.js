const { validateRouteHandler } = require("./validator");

exports.onSellEquipmentValidation = validateRouteHandler({
	id: {
		in: ["body"],
		exists: { errorMessage: "please enter id!" },
	},
	price: {
		in: ["body"],
		exists: { errorMessage: "please enter price!" },
	},
	bodyColor: {
		in: ["body"],
		exists: { errorMessage: "please enter bodyColor!" },
	},
	mileage: {
		in: ["body"],
		exists: { errorMessage: "please enter mileage!" },
	},
	doorCount: {
		in: ["body"],
		exists: { errorMessage: "please enter doorCount!" },
	},
	modelNo: {
		in: ["body"],
		exists: { errorMessage: "please enter modelNo!" },
	},
});

exports.onSellPropertyValidation = validateRouteHandler({
	id: {
		in: ["body"],
		exists: { errorMessage: "please enter id!" },
	},
	price: {
		in: ["body"],
		exists: { errorMessage: "please enter price!" },
	},
	// location: {
	// 	in: ["body"],
	// 	exists: { errorMessage: "please enter location!" },
	// },
});
