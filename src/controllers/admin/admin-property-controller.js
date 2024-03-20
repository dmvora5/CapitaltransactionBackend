const { StatusCodes } = require("http-status-codes");
const Equipment = require("../../models/Equipment");
const Notification = require("../../models/Notification");
const RealEstate = require("../../models/RealEstate");
const { getPaginationDetails } = require("../../utils");

exports.verifyRealEstate = async (req, res, next) => {
	const { id, status } = req.body;

	const realEstate = await RealEstate.findById(id);

	if (!realEstate.verifyed) {
		const userId = realEstate.userId;
		realEstate.verifyed = Boolean(status);
		await Promise.all([
			Notification.create({
				userId,
				title: "Real Estate Verification",
				message: "Your Property Approved Successfully!",
			}),
			realEstate.save(),
		]);
	}

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Verified successfully!",
	});
};

exports.verifyEquipment = async (req, res, next) => {
	const { id, status } = req.body;
	const equipment = await Equipment.findById(id);

	if (!equipment.verifyed) {
		const userId = equipment.userId;
		equipment.verifyed = Boolean(status);
		await Promise.all([
			Notification.create({
				userId,
				title: "Vehical Verification",
				message: "Your Vehical Approved Successfully!",
			}),
			equipment.save(),
		]);
	}

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Verified successfully!",
	});
};

exports.getAllRealEstate = async (req, res, next) => {
	const reqQuery = { ...req.query };
	const { skip, limit } = getPaginationDetails(reqQuery);

	let match = {};
	if (reqQuery.search) {
		match = {
			$or: [
				{ fullName: { $regex: reqQuery.search, $options: "i" } },
				{ address: { $regex: reqQuery.search, $options: "i" } },
				{ email: { $regex: reqQuery.search, $options: "i" } },
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

exports.getAllEquipment = async (req, res, next) => {
	const reqQuery = { ...req.query };
	const { skip, limit } = getPaginationDetails(reqQuery);

	let match = {};
	if (reqQuery.search) {
		match = {
			$or: [
				{ fullName: { $regex: reqQuery.search, $options: "i" } },
				{ address: { $regex: reqQuery.search, $options: "i" } },
				{ titleNo: { $regex: reqQuery.search, $options: "i" } },
				{
					vehicalIdetificationNo: {
						$regex: reqQuery.search,
						$options: "i",
					},
				},
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
