const { StatusCodes } = require("http-status-codes");
const DrivingLicence = require("../models/DrivingLicence");
const {
	uploadImages,
	getPaginationDetails,
	getImagesFromAWS,
} = require("../utils/index");
const Passport = require("../models/Passport");
const RealEstate = require("../models/RealEstate");
const Equipment = require("../models/Equipment");
const Notification = require("../models/Notification");
const DigitalId = require("../models/DigitalId");

exports.createUserDrivingLicence = async (req, res, next) => {
	let payload = req.body;
	const user = req.user;

	const imagesData = await uploadImages({
		req,
		bucketName: process.env.AWS_S3_FILE_BUCKET,
		keyName: "docs",
	});

	if (imagesData["frontImg"] && imagesData["frontImg"][0]) {
		payload.frontImage = imagesData["frontImg"][0]?.location;
		payload.frontImgKey = imagesData["frontImg"][0]?.key;
	}

	const result = await DrivingLicence.create({
		...payload,
		userId: user._id,
	});

	res.status(StatusCodes.OK).json({
		success: true,
		data: result,
		message: "Licence submit successfully",
	});
};

exports.createUserPassport = async (req, res, next) => {
	let payload = req.body;
	const user = req.user;

	const imagesData = await uploadImages({
		req,
		bucketName: process.env.AWS_S3_FILE_BUCKET,
		keyName: "docs",
	});

	if (imagesData["frontImg"] && imagesData["frontImg"][0]) {
		payload.frontImage = imagesData["frontImg"][0]?.location;
		payload.frontImgKey = imagesData["frontImg"][0]?.key;
	}

	const result = await Passport.create({
		...payload,
		userId: user._id,
	});

	res.status(StatusCodes.OK).json({
		success: true,
		data: result,
		message: "Passport submit successfully",
	});
};

exports.createDigitalId = async (req, res, next) => {
	let payload = req.body;
	const user = req.user;

	const imagesData = await uploadImages({
		req,
		bucketName: process.env.AWS_S3_FILE_BUCKET,
		keyName: "docs",
	});

	if (imagesData["frontImg"] && imagesData["frontImg"][0]) {
		payload.frontImage = imagesData["frontImg"][0]?.location;
		payload.frontImgKey = imagesData["frontImg"][0]?.key;
	}

	const result = await DigitalId.create({
		...payload,
		userId: user._id,
	});

	res.status(StatusCodes.OK).json({
		success: true,
		data: result,
		message: "DigitalId submit successfully",
	});
};

exports.addRealEstate = async (req, res, next) => {
	let payload = req.body;
	const user = req.user;

	let cordinates = payload.location?.split(",");

	const geoJson = {
		type: "Point",
		coordinates: cordinates?.length ? cordinates : [],
	};

	const imagesData = await uploadImages({
		req,
		bucketName: process.env.AWS_S3_FILE_BUCKET,
		keyName: `${process.env.AWS_S3_PUBLIC_BUCKET_FOLDER}/realestate`,
	});

	console.log('imagesData["images"]', imagesData);
	if (imagesData["images"] && imagesData["images"].length) {
		payload.images = imagesData["images"]?.map((image) => ({
			key: image?.key,
			url: image?.location,
		}));
	}

	const result = await RealEstate.create({
		...payload,
		location: geoJson,
		userId: user._id,
	});

	res.status(StatusCodes.OK).json({
		success: true,
		data: result,
		message: "Realestate added successfully!",
	});
};

exports.addEquipment = async (req, res, next) => {
	let payload = req.body;
	const user = req.user;

	const imagesData = await uploadImages({
		req,
		bucketName: process.env.AWS_S3_FILE_BUCKET,
		keyName: `${process.env.AWS_S3_PUBLIC_BUCKET_FOLDER}/equipment`,
	});

	if (imagesData["images"] && imagesData["images"].length) {
		payload.images = imagesData["images"]?.map((image) => ({
			key: image?.key,
			url: image?.location,
		}));
	}

	const result = await Equipment.create({
		...payload,
		userId: user._id,
	});

	res.status(StatusCodes.OK).json({
		success: true,
		data: result,
		message: "Equipment added successfully!",
	});
};

exports.userDashboard = async (req, res, next) => {
	const user = req.user;

	//change as we progress
	const [
		digitalIdCount,
		drivingLicenceCount,
		passportCount,
		realEstateCount,
		equipmentCount,
		licence,
		passport,
		digitalId,
	] = await Promise.all([
		DigitalId.countDocuments({ userId: user._id }).lean().exec(),
		DrivingLicence.countDocuments({ userId: user._id }).lean().exec(),
		Passport.countDocuments({ userId: user._id }).lean().exec(),
		RealEstate.countDocuments({ userId: user._id }).lean().exec(),
		Equipment.countDocuments({ userId: user._id }).lean().exec(),
		DrivingLicence.findOne({ userId: user._id }).select("+frontImgKey"),
		Passport.findOne({ userId: user._id }).select("+frontImgKey"),
		DigitalId.findOne({ userId: user._id }).select("+frontImgKey"),
	]);

	const [licenceImage, passportImage, digitalIdImage] = await Promise.all([
		getImagesFromAWS({
			bucketName: process.env.AWS_S3_FILE_BUCKET,
			keyName: licence?.frontImgKey,
		}),
		getImagesFromAWS({
			bucketName: process.env.AWS_S3_FILE_BUCKET,
			keyName: passport?.frontImgKey,
		}),
		getImagesFromAWS({
			bucketName: process.env.AWS_S3_FILE_BUCKET,
			keyName: digitalId?.frontImgKey,
		}),
	]);

	res.status(StatusCodes.OK).json({
		success: true,
		data: {
			digitalIdCount,
			drivingLicenceCount,
			passportCount,
			realEstateCount,
			equipmentCount,
			total:
				digitalIdCount +
				drivingLicenceCount +
				passportCount +
				realEstateCount +
				equipmentCount,
			licenceImage,
			passportImage,
			digitalIdImage,
		},
	});
};

exports.userUplodedDocument = async (req, res, next) => {
	const user = req.user;

	//change as we progress
	const [licence, passport, digitalId] = await Promise.all([
		DrivingLicence.findOne({ userId: user._id }).select("+frontImgKey"),
		Passport.findOne({ userId: user._id }).select("+frontImgKey"),
		DigitalId.findOne({ userId: user._id }).select("+frontImgKey"),
	]);

	const [licenceImage, passportImage, digitalIdImage] = await Promise.all([
		getImagesFromAWS({
			bucketName: process.env.AWS_S3_FILE_BUCKET,
			keyName: licence?.frontImgKey,
		}),
		getImagesFromAWS({
			bucketName: process.env.AWS_S3_FILE_BUCKET,
			keyName: passport?.frontImgKey,
		}),
		getImagesFromAWS({
			bucketName: process.env.AWS_S3_FILE_BUCKET,
			keyName: digitalId?.frontImgKey,
		}),
	]);

	res.status(StatusCodes.OK).json({
		success: true,
		data: [
			{
				name: "Digital ID",
				value: digitalId?.cardNo || null,
				image: digitalIdImage,
			},
			{
				name: "Driving Licence",
				value: licence?.customerId || null,
				image: licenceImage,
			},
			{
				name: "Passport",
				value: passport?.passportNo || null,
				image: passportImage,
			},
		],
	});
};

exports.getUserDigitalId = async (req, res, next) => {
	const user = req.user;

	const digitalId = await DigitalId.findOne({ userId: user._id });

	//TODO: chage pagination when design is updated
	res.status(StatusCodes.OK).json({
		success: true,
		data: digitalId ? [digitalId] : [],
		count: digitalId ? 1 : 0,
		totalPages: digitalId ? 1 : 0,
	});
};

exports.getUserLicences = async (req, res, next) => {
	const user = req.user;

	console.log("user", user);

	const licence = await DrivingLicence.findOne({ userId: user._id });

	console.log("licence", licence);

	//TODO: chage pagination when design is updated
	res.status(StatusCodes.OK).json({
		success: true,
		data: licence ? [licence] : [],
		count: licence ? 1 : 0,
		totalPages: licence ? 1 : 0,
	});
};

exports.getUserPassport = async (req, res, next) => {
	const user = req.user;

	const passport = await Passport.findOne({ userId: user._id });

	//TODO: chage pagination when design is updated
	res.status(StatusCodes.OK).json({
		success: true,
		data: passport ? [passport] : [],
		count: passport ? 1 : 0,
		totalPages: passport ? 1 : 0,
	});
};

exports.getAllUserRealEstate = async (req, res, next) => {
	const user = req.user;

	const reqQuery = { ...req.query };
	const { skip, limit } = getPaginationDetails(reqQuery);

	let match = {
		userId: user._id,
	};

	if (reqQuery.search) {
		match = {
			...match,
			$or: [
				{ fullName: { $regex: reqQuery.search, $options: "i" } },
				{ email: { $regex: reqQuery.search, $options: "i" } },
			],
		};
	}

	const [records, count] = await Promise.all([
		RealEstate.find(match).skip(skip).limit(limit).lean().exec(),
		RealEstate.countDocuments(match),
	]);

	res.status(StatusCodes.OK).json({
		success: true,
		data: records,
		count: count,
		totalPages: Math.ceil(count / limit),
	});
};

exports.getAllUserEquipment = async (req, res, next) => {
	const user = req.user;

	console.log("userasdadasd", user);

	const reqQuery = { ...req.query };
	const { skip, limit } = getPaginationDetails(reqQuery);

	let match = {
		userId: user._id,
	};

	if (reqQuery.search) {
		match = {
			...match,
			$or: [
				{ fullName: { $regex: reqQuery.search, $options: "i" } },
				{
					vehicalIdetificationNo: {
						$regex: reqQuery.search,
						$options: "i",
					},
				},
				{
					titleNo: {
						$regex: reqQuery.search,
						$options: "i",
					},
				},
			],
		};
	}

	const [records, count] = await Promise.all([
		Equipment.find(match).skip(skip).limit(limit).lean().exec(),
		Equipment.countDocuments(match),
	]);

	res.status(StatusCodes.OK).json({
		success: true,
		data: records,
		count: count,
		totalPages: Math.ceil(count / limit),
	});
};

exports.getUserNotifications = async (req, res, next) => {
	const user = req.user;

	const reqQuery = { ...req.query };
	const { skip, limit } = getPaginationDetails(reqQuery);

	let match = {
		userId: user._id,
	};

	const [records, count, unreadCount] = await Promise.all([
		Notification.find(match).skip(skip).limit(limit).lean().exec(),
		Notification.countDocuments(match),
		Notification.countDocuments({
			...match,
			view: false,
		}),
	]);

	res.status(StatusCodes.OK).json({
		success: true,
		data: records,
		count: count,
		totalPages: Math.ceil(count / limit),
		unreadCount,
	});
};

exports.updateViewStatusOfNotification = async (req, res, next) => {
	const user = req.user;
	const { id, viewAll } = req.body;
	if (Boolean(viewAll)) {
		await Notification.updateMany(
			{
				userId: user._id,
				view: false,
			},
			{
				view: true,
			}
		);
	} else {
		await Notification.findByIdAndUpdate(id, {
			view: true,
		});
	}

	res.status(StatusCodes.OK).json({
		success: true,
		message: "",
	});
};
