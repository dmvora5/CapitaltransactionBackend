const { validateRouteHandler } = require("./validator");

exports.idValidation = validateRouteHandler({
	id: {
		in: ["params"],
		exists: { errorMessage: "please enter id!" },
	},
});

exports.createCategoryValidation = validateRouteHandler({
	type: {
		in: ["body"],
		exists: { errorMessage: "please enter type" },
	},
	name: {
		in: ["body"],
		exists: { errorMessage: "please enter name" },
	},
	value: {
		in: ["body"],
		exists: { errorMessage: "please enter value" },
	},
});

exports.updateCategoryValidation = validateRouteHandler({
	id: {
		in: ["params"],
		exists: { errorMessage: "please enter id!" },
	},
	type: {
		in: ["body"],
		exists: { errorMessage: "please enter type" },
	},
	name: {
		in: ["body"],
		exists: { errorMessage: "please enter name" },
	},
	value: {
		in: ["body"],
		exists: { errorMessage: "please enter value" },
	},
});
