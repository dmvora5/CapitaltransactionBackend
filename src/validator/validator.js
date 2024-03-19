const { validationResult, checkSchema } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const ErrorHandler = require("../utils/ErrorHandler");

const routeError = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const errorArray = errors.array()?.map((err) => err?.msg);
		return next(
			new ErrorHandler(errorArray, StatusCodes.UNPROCESSABLE_ENTITY)
		);
	}
	next();
};

const saveOriginalRequestData = (req, res, next) => {
	res.locals.originalBody = { ...req.body };
	res.locals.originalParams = { ...req.params };
	next();
};


module.exports.validateRouteHandler = (schema) => {
	return [saveOriginalRequestData, checkSchema(schema), routeError];
};

const joyValidation = (schema) => (req, res, next) => {
	const { error, value } = schema.validate(req.body);
	console.log({ error, value }, req.files);
	if (error) {
		const errorMessage = error.details.map((detail) => detail.message);
		return next(
			new ErrorHandler(errorMessage, StatusCodes.UNPROCESSABLE_ENTITY)
		);
	}
	next();
};

exports.joiValidation = (schema) => {
	return [saveOriginalRequestData, joyValidation(schema)];
};
