const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema(
	{
		vehicalIdetificationNo: { type: String, required: true },
		titleNo: { type: String, required: true },
		year: { type: String, required: true },
		make: { type: String, required: true },
		vehicalBody: { type: String, required: true },
		emptyWGT: { type: String, required: true },
		grossWGT: { type: String, required: true },
		GVWR: { type: String, required: true },
		GCWR: { type: String, required: true },
		AXLES: { type: String, required: true },
		Fuel: { type: String, required: true },
		SalesTaxPaid: { type: String, required: true },
		ODOMeter: { type: String, required: true },
		DateIsuued: { type: Date, required: true },
		OtherPartinantDate: { type: Date, required: true },
		OddMeterBrand: { type: String, required: true },
		PriorTitleNo: { type: String, required: true },
		fullName: { type: String, required: true },
		address: { type: String, required: true },
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
		bodyColor: String,
		mileage: Number,
		doorCount: Number,
		description: String,
		modelNo: String,
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

equipmentSchema.index({ email: 1 });
equipmentSchema.index({ fullName: 1 });

const Equipment = mongoose.model("equipments", equipmentSchema);

module.exports = Equipment;
