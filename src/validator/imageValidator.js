const Joi = require("joi");
const ErrorHandler = require("../utils/ErrorHandler");
const { StatusCodes } = require("http-status-codes");

const schema = Joi.object({
	fieldname: Joi.string().required(),
	originalname: Joi.string().required(),
	encoding: Joi.string().valid("base64", "binary", "hex", "7bit").required(),
	mimetype: Joi.string()
		.valid("image/jpeg", "image/png", "image/gif")
		.required(),
	size: Joi.number()
		// .min(1)
		// .max(1024 * 1024 * 10)
		.required(), // Adjust maximum size as necessary (here, 10MB)
	buffer: Joi.binary().required(),
}).required();

exports.validateImage = (req, res, next) => {
	if(!req.files?.length) {
		 return next(
			new ErrorHandler(
				'image required!',
				StatusCodes.UNPROCESSABLE_ENTITY
			)
		);
	}
	for (const file of req.files || []) {
		const { error, value } = schema.validate(file);
		if (error) {
			if (error) {
				const errorMessage = error.details.map(
					(detail) => detail.message
				);

				return next(
					new ErrorHandler(
						errorMessage,
						StatusCodes.UNPROCESSABLE_ENTITY
					)
				);
			}
		}
	}
	next();
};
