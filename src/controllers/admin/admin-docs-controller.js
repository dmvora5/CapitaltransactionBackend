const { StatusCodes } = require("http-status-codes");
const DrivingLicence = require("../../models/DrivingLicence");
const Passport = require("../../models/Passport");
const Notification = require("../../models/Notification");
const { getPaginationDetails, getImagesFromAWS } = require("../../utils");

exports.updateLicenceStatus = async (req, res, next) => {
	const { id, status } = req.body;

	const licence = await DrivingLicence.findById(id);

	if (!licence.verifyed) {
		const userId = licence.userId;
		licence.verifyed = Boolean(status);
		await Promise.all([
			Notification.create({
				userId,
				title: "Licence Verification",
				message: "Your Licence Approved Successfully!",
			}),
			licence.save(),
		]);
	}

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Verified successfully!",
	});
};

exports.updatePassportStatus = async (req, res, next) => {
	const { id, status } = req.body;

	console.log("id", id);

	const passport = await Passport.findById(id);

	if (!passport.verifyed) {
		const userId = passport.userId;
		passport.verifyed = Boolean(status);
		await Promise.all([
			Notification.create({
				userId,
				title: "Passport Verification",
				message: "Your Passport Approved Successfully!",
			}),
			passport.save(),
		]);
	}

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Verified successfully!",
	});
};

exports.getAllLicence = async (req, res, next) => {
	const reqQuery = { ...req.query };
	const { skip, limit } = getPaginationDetails(reqQuery);

	let match = {};
	if (reqQuery.search) {
		match = {
			$or: [
				{ fullName: { $regex: reqQuery.search, $options: "i" } },
				{ customerId: { $regex: reqQuery.search, $options: "i" } },
			],
		};
	}

	if (reqQuery.status) {
		match = {
			...match,
			verifyed: Boolean(reqQuery.status),
		};
	}

	const [records, count] = await Promise.all([
		DrivingLicence.find(match).skip(skip).limit(limit).lean().exec(),
		DrivingLicence.countDocuments(match),
	]);

	res.status(StatusCodes.OK).json({
		success: true,
		data: records,
		count: count,
		totalPages: Math.ceil(count / limit),
	});
};

exports.getAllPassport = async (req, res, next) => {
	const reqQuery = { ...req.query };
	const { skip, limit } = getPaginationDetails(reqQuery);

	let match = {};
	if (reqQuery.search) {
		match = {
			$or: [
				{ fullName: { $regex: reqQuery.search, $options: "i" } },
				{ nationality: { $regex: reqQuery.search, $options: "i" } },
				{ passportNo: { $regex: reqQuery.search, $options: "i" } },
				{ country: { $regex: reqQuery.search, $options: "i" } },
			],
		};
	}

	if (reqQuery.status) {
		match = {
			...match,
			verifyed: Boolean(reqQuery.status),
		};
	}

	const [records, count] = await Promise.all([
		Passport.find(match).skip(skip).limit(limit).lean().exec(),
		Passport.countDocuments(match),
	]);

	res.status(StatusCodes.OK).json({
		success: true,
		data: records,
		count: count,
		totalPages: Math.ceil(count / limit),
	});
};

exports.getLicence = async (req, res, next) => {
	const { id } = req.params;
	let result = await DrivingLicence.findById(id)
		.select("+frontImgKey")
		.lean()
		.exec();

	const image = await getImagesFromAWS({
		bucketName: process.env.AWS_S3_FILE_BUCKET,
		keyName: result.frontImgKey,
	});

	result = {
		...result,
		frontImage: image,
	};

	res.status(StatusCodes.OK).json({
		success: true,
		data: result,
	});
};

exports.getPassport = async (req, res, next) => {
	const { id } = req.params;
	let result = await Passport.findById(id)
		.select("+frontImgKey")
		.lean()
		.exec();

	const image = await getImagesFromAWS({
		bucketName: process.env.AWS_S3_FILE_BUCKET,
		keyName: result.frontImgKey,
	});

	result = {
		...result,
		frontImage: image,
	};

	res.status(StatusCodes.OK).json({
		success: true,
		data: result,
	});
};
