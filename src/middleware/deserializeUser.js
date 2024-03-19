const { StatusCodes } = require("http-status-codes");
const ErrorHandler = require("../utils/ErrorHandler");
const { verifyJwt } = require("../utils/jwtUtils");
const User = require("../models/User");

exports.deserializeUser = async (req, res, next) => {
	let access_token;

	console.log("req.cookies", req.cookies);
	if (
		(req.headers.authorization &&
			req.headers.authorization.startsWith("Bearer")) ||
		(req.headers.Authorization &&
			req.headers.Authorization.startsWith("Bearer"))
	) {
		access_token =
			req.headers.authorization.split(" ")[1] ||
			req.headers.Athorization.split(" ")[1];
	} else if (req.cookies.access_token) {
		access_token = req.cookies.access_token;
	}

	if (!access_token) {
		return next(
			new ErrorHandler("You are not logged in", StatusCodes.UNAUTHORIZED)
		);
	}

	const decode = verifyJwt({
		token: access_token,
		secret: process.env.ACCESS_TOKEN_SECRET,
	});
	if (!decode) {
		return next(
			new ErrorHandler(
				"Invalid token or user doesn't exist",
				StatusCodes.FORBIDDEN
			)
		);
	}

	const user = await User.findById(decode._id);

	if (!user) {
		return next(
			new ErrorHandler(
				"User with that token no longer exist",
				StatusCodes.NOT_FOUND
			)
		);
	}

	req.user = user;

	next();
};

exports.requiredUser = async (req, res, next) => {
	const user = req.user;
	if (!user) {
		return next(
			new ErrorHandler(
				"Invalid token or user not found",
				StatusCodes.FORBIDDEN
			)
		);
	}
	next();
};

exports.restrictTo = (allowedRole) => (req, res, next) => {
	const user = req.user;
	if (!user.roles.includes(allowedRole)) {
		return next(
			new ErrorHandler(
				"You are not allowed to perform this action",
				StatusCodes.FORBIDDEN
			)
		);
	}
	next();
};
