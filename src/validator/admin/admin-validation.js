const { validateRouteHandler } = require("../validator");

exports.adminLoginValidation = validateRouteHandler({
	email: {
		in: ["body"],
		exists: { errorMessage: "please enter email!" },
	},
	password: {
		in: ["body"],
		exists: { errorMessage: "please enter password!" },
	},
});

exports.docVerifyValidation = validateRouteHandler({
	id: {
		in: ["body"],
		exists: { errorMessage: "please enter id!" },
	},
});

exports.statusValidation = validateRouteHandler({
	id: {
		in: ["body"],
		exists: { errorMessage: "please enter id!" },
	},
	status: {
		in: ["body"],
		exists: { errorMessage: "please enter status!" },
	},
});
