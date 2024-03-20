const { StatusCodes } = require("http-status-codes");
const Equipment = require("../models/Equipment");
const RealEstate = require("../models/RealEstate");

exports.getRealEstate = async (req, res, next) => {
	const { id } = req.params;
	const result = await RealEstate.findById(id).lean().exec();
	res.status(StatusCodes.OK).json({
		success: true,
		data: result,
	});
};

exports.getEquipment = async (req, res, next) => {
	const { id } = req.params;
	const result = await Equipment.findById(id).lean().exec();
	res.status(StatusCodes.OK).json({
		success: true,
		data: result,
	});
};
