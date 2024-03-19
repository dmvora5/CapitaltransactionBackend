const { StatusCodes } = require("http-status-codes");
const Category = require("../../models/Category");

exports.getCategory = async (req, res, next) => {
	const { id } = req.params;
	const result = await Category.findById(id).lean().exec();
	res.status(StatusCodes.OK).json({
		success: true,
		data: result,
	});
};

exports.createCategory = async (req, res, next) => {
	const { type, name, value } = req.body;
	const result = await Category.create({
		type,
		name,
		value,
	});

	res.status(StatusCodes.OK).json({
		success: true,
		data: result,
		message: "Category created successfully!",
	});
};

exports.updateCategory = async (req, res, next) => {
	const { id } = req.params;

	const result = await Category.findByIdAndUpdate(id, req.body);
	res.status(StatusCodes.OK).json({
		success: true,
		data: result,
		message: "Category update successfully!",
	});
};

exports.deleteCategory = async (req, res, next) => {
	const { id } = req.params;

	const result = await Category.findByIdAndDelete(id);
	res.status(StatusCodes.OK).json({
		success: true,
		data: result,
		message: "Category delete successfully!",
	});
};
