const { StatusCodes } = require("http-status-codes");
const Equipment = require("../models/Equipment");
const ErrorHandler = require("../utils/ErrorHandler");
const RealEstate = require("../models/RealEstate");
const { getPaginationDetails } = require("../utils");

exports.launchEquipmentOnMarket = async (req, res, next) => {
	const { id, price, bodyColor, mileage, doorCount, description, modelNo } =
		req.body;
	const user = req.user;

	const equipment = await Equipment.findOne({
		_id: id,
		userId: user.id,
	});

	if (!equipment) {
		return next(
			new ErrorHandler("No Equipment found", StatusCodes.BAD_REQUEST)
		);
	}

	if (!equipment.verifyed) {
		return next(
			new ErrorHandler(
				"Equipment not verified yet",
				StatusCodes.BAD_REQUEST
			)
		);
	}

	if (equipment.status === "OnSell" || equipment.isOnSale) {
		return next(
			new ErrorHandler(
				"Equipment Already on sell",
				StatusCodes.BAD_REQUEST
			)
		);
	}

	equipment.price = Number(price);
	equipment.bodyColor = bodyColor;
	equipment.mileage = Number(mileage);
	equipment.doorCount = Number(doorCount);
	equipment.description = description || "";
	equipment.modelNo = modelNo;
	equipment.status = "OnSell";
	equipment.isOnSale = true;
	await equipment.save();

	res.status(StatusCodes.OK).json({
		success: true,
		data: null,
		message: "Equipment successfully put on sell",
	});
};

exports.launchRealEstateOnMarket = async (req, res, next) => {
	const { id, price } = req.body;
	const user = req.user;

	const property = await RealEstate.findOne({
		_id: id,
		userId: user.id,
	});

	if (!property) {
		return next(
			new ErrorHandler("No Property found", StatusCodes.BAD_REQUEST)
		);
	}

	if (!property.verifyed) {
		return next(
			new ErrorHandler(
				"Property not verified yet",
				StatusCodes.BAD_REQUEST
			)
		);
	}

	if (property.status === "OnSell" || property.isOnSale) {
		return next(
			new ErrorHandler(
				"Property Already on sell",
				StatusCodes.BAD_REQUEST
			)
		);
	}

	property.price = Number(price);
	property.status = "OnSell";
	property.isOnSale = true;
	await property.save();

	res.status(StatusCodes.OK).json({
		success: true,
		data: null,
		message: "Property successfully put on sell",
	});
};

exports.getAllEquipmentOnMarketPlace = async (req, res, next) => {
	const reqQuery = { ...req.query };
	const { skip, limit } = getPaginationDetails(reqQuery);

	let match = {
		// status: "OnSell",
	};

	if (reqQuery.cateroryId) {
		match.cateroryId = cateroryId;
	}

	if (reqQuery.search) {
		match = {
			$or: [
				{
					vehicalIdetificationNo: {
						$regex: reqQuery.search,
						$options: "i",
					},
				},
				{ modelNo: { $regex: reqQuery.search, $options: "i" } },
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

exports.getAllPropertyMarketPlace = async (req, res, next) => {
	const reqQuery = { ...req.query };
	const { skip, limit } = getPaginationDetails(reqQuery);

	let match = {
		status: "OnSell",
	};

	if (reqQuery.cateroryId) {
		match.cateroryId = cateroryId;
	}

	if (reqQuery.search) {
		match = {
			$or: [
				{
					vehicalIdetificationNo: {
						$regex: reqQuery.search,
						$options: "i",
					},
				},
				{ modelNo: { $regex: reqQuery.search, $options: "i" } },
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

exports.getEquipmentMarketPlace = async (req, res, next) => {
	const { id } = req.params;

	const record = await Equipment.findById(id);

	res.status(StatusCodes.OK).json({
		success: true,
		data: record,
	});
};

exports.gePropertyMarketPlace = async (req, res, next) => {
	const { id } = req.params;

	const record = await RealEstate.findById(id);

	res.status(StatusCodes.OK).json({
		success: true,
		data: record,
	});
};
