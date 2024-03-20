const mongoose = require("mongoose");

const realEstateSchema = new mongoose.Schema(
	{
		fullName: { type: String, required: true },
		location: { type: String, required: true },
		address: { type: String, required: true },
		propertyAddress: { type: String, required: true },
		email: { type: String, required: true },
		phoneNo: { type: String, required: true },
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
		},
		cateroryId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "categories",
		},
		images: [
			{
				key: { type: String, required: true, select: false },
				url: { type: String, required: true },
			},
		],
		verifyed: { type: Boolean, default: false },
		isOnSale: { type: Boolean, default: false },
		status: {
			type: String,
			enum: ["Owned", "Sold", "OnSell"],
			default: "Owned",
		},

		price: { type: Number },
		location: {
			type: {
				type: String, // Don't do `{ location: { type: String } }`
				enum: ["Point"], // 'location.type' must be 'Point'
				// required: true,
			},
			coordinates: {
				type: [Number],
				// required: true,
			},
		},
	},
	{
		timestamps: true,
		strict: false,
	}
);

realEstateSchema.index({ email: 1 });
realEstateSchema.index({ fullName: 1 });

const RealEstate = mongoose.model("realestate", realEstateSchema);

module.exports = RealEstate;
