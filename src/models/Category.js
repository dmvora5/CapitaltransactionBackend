const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
	{
		type: { type: String, enum: ["RealEstate", "Equipment"] },
		name: { type: String, required: true, unique: true },
		value: { type: String, required: true, unique: true },
	},
	{
		timestamps: true,
	}
);

categorySchema.index({ name: 1 });

const Category = mongoose.model("categories", categorySchema);

module.exports = Category;
