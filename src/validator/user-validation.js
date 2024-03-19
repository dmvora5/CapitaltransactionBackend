const { validateRouteHandler } = require("./validator");

exports.registerUserValidation = validateRouteHandler({
	userName: {
		in: ["body"],
		exists: { errorMessage: "please enter username!" },
	},
	countryCode: {
		in: ["body"],
		exists: { errorMessage: "please enter countryCode!" },
	},
	phoneNo: {
		in: ["body"],
		exists: { errorMessage: "please enter phoneNo!" },
	},
	email: {
		in: ["body"],
		exists: { errorMessage: "please enter email!" },
	},
	password: {
		in: ["body"],
		exists: { errorMessage: "please enter password!" },
	},
});

exports.updateUserValidation = validateRouteHandler({
	userName: {
		in: ["body"],
		exists: { errorMessage: "please enter username!" },
	},
	countryCode: {
		in: ["body"],
		exists: { errorMessage: "please enter countryCode!" },
	},
	phoneNo: {
		in: ["body"],
		exists: { errorMessage: "please enter phoneNo!" },
	},
	email: {
		in: ["body"],
		exists: { errorMessage: "please enter email!" },
	},
});

exports.updatePasswordValidation = validateRouteHandler({
	password: {
		in: ["body"],
		exists: { errorMessage: "please enter password!" },
	},
	newPassword: {
		in: ["body"],
		exists: { errorMessage: "please enter newPassword!" },
	},
});

exports.verifyEmailValidation = validateRouteHandler({
	otp: {
		in: ["body"],
		exists: { errorMessage: "please enter otp" },
	},
});

exports.sendOtpValidation = validateRouteHandler({
	email: {
		in: ["body"],
		exists: { errorMessage: "please enter email" },
	},
});

exports.forgetPasswordValidation = validateRouteHandler({
	email: {
		in: ["body"],
		exists: { errorMessage: "please enter email" },
	},
});

exports.changePasswordValidation = validateRouteHandler({
	oldPassword: {
		in: ["body"],
		exists: { errorMessage: "please enter oldPassword" },
	},
	newPassword: {
		in: ["body"],
		exists: { errorMessage: "please enter newPassword" },
	},
});

exports.resetPasswordValidation = validateRouteHandler({
	otp: {
		in: ["body"],
		exists: { errorMessage: "please enter otp" },
	},
	password: {
		in: ["body"],
		exists: { errorMessage: "please enter password" },
	},
});

exports.loginValidation = validateRouteHandler({
	email: {
		in: ["body"],
		exists: { errorMessage: "please enter email" },
	},
	password: {
		in: ["body"],
		exists: { errorMessage: "please enter password" },
	},
});

exports.validateUpdateNotficationStatus = validateRouteHandler({
	id: {
		in: ["body"],
		exists: { errorMessage: "please enter id" },
	},
});
