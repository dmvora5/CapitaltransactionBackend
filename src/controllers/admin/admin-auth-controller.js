const { StatusCodes } = require("http-status-codes");
const User = require("../../models/User");
const { signToken } = require("../../services/userServices");
const ErrorHandler = require("../../utils/ErrorHandler");

const accessTokenCookieOptions = {
	expires: new Date(
		Date.now() +
			Number(process.env.ACCESS_TOKEN_EXPIRETION_COOKIE) * 60 * 1000
	),
	maxAge: Number(process.env.ACCESS_TOKEN_EXPIRETION_COOKIE) * 60 * 1000,
	httpOnly: true,
	sameSite: "lax",
};

const refreshTokenCookieOptions = {
	expires: new Date(
		Date.now() +
			Number(process.env.REFRESH_TOKEN_EXPIRATION_COOKIE) * 60 * 1000
	),
	maxAge: Number(process.env.REFRESH_TOKEN_EXPIRATION_COOKIE) * 60 * 1000,
	httpOnly: true,
	sameSite: "lax",
};

if (process.env.NODE_ENV === "production") {
	accessTokenCookieOptions.secure = true;
	refreshTokenCookieOptions.secure = true;
	accessTokenCookieOptions.sameSite = "None";
	refreshTokenCookieOptions.sameSite = "None";
}

if (process.env.NODE_ENV === "staging") {
	accessTokenCookieOptions.secure = true;
	refreshTokenCookieOptions.secure = true;
	accessTokenCookieOptions.sameSite = "None";
	refreshTokenCookieOptions.sameSite = "None";
}

exports.loginAdmin = async (req, res, next) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email: email }).select("+password");

	if (!user || !(await user?.comparePasswords(password))) {
		return next(
			new ErrorHandler(
				"Invalid email or password",
				StatusCodes.UNAUTHORIZED
			)
		);
	}

	if (!user.roles.includes("Admin")) {
		return next(
			new ErrorHandler(
				"You are not aurthorize for this site",
				StatusCodes.UNAUTHORIZED
			)
		);
	}

	if (!user.verified) {
		return next(
			new ErrorHandler(
				"You are not verified, check your email to verify your account",
				StatusCodes.UNAUTHORIZED
			)
		);
	}

	const { access_token, refresh_token } = await signToken(user);

	res.cookie("access_token", access_token, accessTokenCookieOptions);
	res.cookie("refresh_token", refresh_token, refreshTokenCookieOptions);
	res.cookie("logged_in", true, {
		...accessTokenCookieOptions,
		httpOnly: false,
	});

	res.status(StatusCodes.OK).json({
		success: true,
		data: {
			email: user.email,
			userName: user.userName,
			expireAt:
				Date.now() +
				Number(process.env.REFRESH_TOKEN_EXPIRATION_COOKIE) * 60 * 1000,
			accessToken: access_token,
			refreshToken: refresh_token,
		},
		message: "Login successfull",
	});
};
