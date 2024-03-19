const { StatusCodes } = require("http-status-codes");
const Category = require("../models/Category");
const { getPaginationDetails } = require("../utils");

exports.getAllCategory = async (req, res, next) => {
	const reqQuery = { ...req.query };
	const { skip, limit } = getPaginationDetails(reqQuery);

	let match = {};
	if (reqQuery.search) {
		match = {
			$or: [
				{ name: { $regex: reqQuery.search, $options: "i" } },
				{ value: { $regex: reqQuery.search, $options: "i" } },
			],
		};
	}

	if(reqQuery.type) {
		match ={ 
			...match,
			type: reqQuery.type
		}
	}

	const [records, count] = await Promise.all([
		Category.find(match).skip(skip).limit(limit).lean().exec(),
		Category.countDocuments(match),
	]);

	res.status(StatusCodes.OK).json({
		success: true,
		data: records,
		count: count,
		totalPages: Math.ceil(count / limit),
	});
};
