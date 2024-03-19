const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");
const ErrorHandler = require("../utils/ErrorHandler");
const User = require("../models/User");
const Email = require("../utils/email");
const { signToken } = require("../services/userServices");
const { verifyJwt, getAccessToken } = require("../utils/jwtUtils");
const { redisInstance } = require("../config/connectDb");
const Otp = require("../models/Otp");
const { genrateOtp, uploadImages, deleteImagesFromAWS } = require("../utils");

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
	// accessTokenCookieOptions.sameSite = "none";
	// refreshTokenCookieOptions.sameSite = "none";
}

if (process.env.NODE_ENV === "staging") {
	accessTokenCookieOptions.secure = true;
	refreshTokenCookieOptions.secure = true;
	accessTokenCookieOptions.sameSite = "none";
	refreshTokenCookieOptions.sameSite = "none";
}

const logout = (res) => {
	res.cookie("access_token", "", { maxAge: 1 });
	res.cookie("refresh_token", "", { maxAge: 1 });
	res.cookie("logged_in", "", { maxAge: 1 });
};

const sendMail = async ({ user, code }) => {
	try {
		await new Email(user).sendOtp(code);
	} catch (err) {
		throw new ErrorHandler(
			"There was an error sending email, please try again",
			StatusCodes.INTERNAL_SERVER_ERROR
		);
	}
};

exports.createUser = async (req, res, next) => {
	try {
		const { userName, countryCode, phoneNo, email, password } = req.body;
		const record = await User.findOne({ email: email });
		console.log("record");
		if (record && record.verified) {
			return next(
				new ErrorHandler("user already exiests!", StatusCodes.CONFLICT)
			);
		}
		const otp = genrateOtp();

		await Otp.findOneAndUpdate(
			{
				email: email,
			},
			{
				email: email,
				otp: otp,
			},
			{
				upsert: true,
				new: true,
			}
		);

		if (record && !record.verified) {
			await record.save();
			await sendMail({
				user: record,
				code: otp,
			});
			return res.status(StatusCodes.OK).json({
				success: true,
				message: "An email with a otp has been sent to your email",
				data: record.email,
			});
		}

		const user = await User.create({
			userName,
			countryCode,
			phoneNo,
			email,
			password,
		});

		console.log("user", user);

		// const redirectUrl = `${process.env.FRONTEND_URL}/verifyemail/${verificationCode}`;
		await sendMail({ user: user, code: otp });

		res.status(StatusCodes.OK).json({
			success: true,
			message:
				"An email with a verification otp has been sent to your email",
			data: user.email,
		});
		//mail
	} catch (err) {
		if (err.code === 11000) {
			return next(
				new ErrorHandler("Email already exist", StatusCodes.CONFLICT)
			);
		}
		console.log("err", err);
		next(err);
	}
};

exports.loginUser = async (req, res, next) => {
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

exports.verifyEmail = async (req, res, next) => {
	// const verificationCode = crypto
	// 	.createHash("sha256")
	// 	.update(req.params.verificationCode)
	// 	.digest("hex");

	const { otp } = req.body;
	const otpData = await Otp.findOne({ otp });

	if (!otpData) {
		return next(
			new ErrorHandler(
				"Otp expired or invalid!",
				StatusCodes.UNAUTHORIZED
			)
		);
	}
	await Promise.allSettled([
		Otp.findOneAndDelete({
			otp,
		}),
		User.findOneAndUpdate(
			{
				email: otpData.email,
			},
			{
				verified: true,
			}
		),
	]);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Email verified successfully!",
	});
};

exports.refreshAccessToken = async (req, res, next) => {
	const refresh_token =
		req.cookies.refresh_token ||
		req.headers.authorization ||
		req.headers.Authorization;

	const decode = verifyJwt({
		token: refresh_token,
		secret: process.env.REFRESH_TOKEN_SECRET,
	});

	console.log("decode", decode);

	if (!decode) {
		logout(res);
		return next(
			new ErrorHandler(
				"Could not refresh access token",
				StatusCodes.UNAUTHORIZED
			)
		);
	}

	//    Check if the user has a valid session
	//    const session = await redisInstance.get(decoded?.userInfo?._id);
	//    if (!session) {
	//      return next(new ErrorHandler('Could not refresh access token', StatusCodes.FORBIDDEN));
	//    }

	const user = await User.findOne({ email: decode.email });

	if (!user) {
		return next(
			new ErrorHandler(
				"Could not refresh access token",
				StatusCodes.UNAUTHORIZED
			)
		);
	}

	const access_token = getAccessToken(user);

	res.cookie("access_token", access_token, accessTokenCookieOptions);
	res.cookie("logged_in", true, {
		...accessTokenCookieOptions,
		httpOnly: false,
	});

	res.status(StatusCodes.OK).json({
		success: true,
		data: access_token,
	});
};

exports.logoutUser = async (req, res, next) => {
	// const user = res.locals.user;
	// await redisInstance.del(user._id);
	logout(res);
	res.status(200).json({ success: true });
};

exports.forgetPassword = async (req, res, next) => {
	const { email } = req.body;

	const user = await User.findOne({ email: email });

	const message =
		"You will receive a password reset email if user with that email exist";

	if (!user) {
		return next(new ErrorHandler(message, StatusCodes.NOT_FOUND));
	}

	if (!user.verified) {
		return next(
			new ErrorHandler(
				"User email not verified yet",
				StatusCodes.NOT_FOUND
			)
		);
	}

	const otp = genrateOtp();
	await Otp.findOneAndUpdate(
		{
			email: user.email,
		},
		{
			email: user.email,
			otp: otp,
		},
		{
			upsert: true,
			new: true,
		}
	);

	// const resetToken = user.createPasswordResetToken();
	// await user.save({ validateBeforeSave: false });

	// const url = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
	await sendMail({
		user: user,
		code: otp,
	});

	res.status(StatusCodes.OK).json({
		success: true,
		message: message,
		data: user.email,
	});

	// try {
	// 	await new Email(user, url).sendPasswordResetToken(resetToken);
	// 	return res.status(StatusCodes.OK).json({
	// 		success: true,
	// 		message: message,
	// 	});
	// } catch (err) {
	// 	user.passwordResetToken = null;
	// 	user.passwordResetAt = null;
	// 	await user.save({ validateBeforeSave: false });

	// 	return next(
	// 		new ErrorHandler(
	// 			"There was an error sending email, please try again",
	// 			StatusCodes.INTERNAL_SERVER_ERROR
	// 		)
	// 	);
	// }
};

exports.resetPassword = async (req, res, next) => {
	const { password, otp } = req.body;
	// const resetToken = crypto
	// 	.createHash("sha256")
	// 	.update(req.params.resetToken)
	// 	.digest("hex");

	// const user = await User.findOne({
	// 	passwordResetToken: resetToken,
	// 	passwordResetAt: { $gt: new Date() },
	// });
	const otpData = await Otp.findOne({
		otp: otp,
	});

	if (!otpData) {
		return next(
			new ErrorHandler(
				"Otp is invalid or has expired",
				StatusCodes.NOT_FOUND
			)
		);
	}

	const user = await User.findOne({
		email: otpData.email,
	});
	user.password = password;
	// user.passwordResetToken = null;
	// user.passwordResetAt = null;
	await user.save();
	await Otp.findOneAndDelete({
		otp: otp,
	});

	res.status(200).json({
		success: true,
		message:
			"Password data successfully updated, please login with your new credentials",
	});
};

exports.resend = async (req, res, next) => {
	const { email } = req.body;

	const user = await User.findOne({
		email: email,
	});

	if (!user) {
		return next(new ErrorHandler("No user found", StatusCodes.BAD_REQUEST));
	}

	const otp = genrateOtp();

	await Otp.findOneAndUpdate(
		{
			email: email,
		},
		{
			email: email,
			otp: otp,
		},
		{
			upsert: true,
			new: true,
		}
	);

	await sendMail({
		user: user,
		code: otp,
	});

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Otp send on your email!",
		data: user.email,
	});
};

exports.getUserDetails = async (req, res, next) => {
	const user = req.user;
	const details = await User.findById(user._id)
		.select("-roles -aggreTermsAndConditions -verified")
		.lean()
		.exec();
	res.status(StatusCodes.OK).json({
		success: true,
		data: details,
	});
};

exports.updateUser = async (req, res, next) => {
	const { fullName } = req.body;
	const user = req.user;

	const payload = { fullName };

	const imagesData = await uploadImages({
		req,
		bucketName: process.env.AWS_S3_FILE_BUCKET,
		keyName: `${process.env.AWS_S3_PUBLIC_BUCKET_FOLDER}/user`,
	});

	if (imagesData["profilePic"] && imagesData["profilePic"][0]) {
		const oldImage = await User.findById(user._id).select("+profilePicKey");
		deleteImagesFromAWS({
			bucketName: process.env.AWS_S3_FILE_BUCKET,
			keyName: oldImage.profilePicKey,
		});
		payload.profilePic = imagesData["profilePic"][0]?.location;
		payload.profilePicKey = imagesData["profilePic"][0]?.key;
	}

	await User.findByIdAndUpdate(user._id, payload);

	res.status(StatusCodes.OK).json({
		success: true,
		data: null,
		message: "User updated successfully!",
	});
};

exports.updatePassword = async (req, res, next) => {
	const { oldPassword, newPassword } = req.body;
	const user = req.user;

	const record = await User.findById(user._id).select("+password");
	if (!record) {
		logout(res);
		return next(
			new ErrorHandler(
				"You are not aurthorized",
				StatusCodes.UNAUTHORIZED
			)
		);
	}

	if (!(await record.comparePasswords(oldPassword))) {
		return next(
			new ErrorHandler(
				"Your Credentials dose not match",
				StatusCodes.BAD_REQUEST
			)
		);
	}

	record.password = newPassword;
	await record.save();

	logout(res);

	res.status(StatusCodes.OK).json({
		success: true,
		message:
			"Password updated successfully! please login with new password",
	});
};
