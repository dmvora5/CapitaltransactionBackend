const mongoose = require("mongoose");

const digitalIdSchema = new mongoose.Schema(
	{
		fullName: { type: String, required: true },
		cardNo: { type: String, required: true },
		email: { type: String, required: true },
		phoneNo: { type: String, required: true },
		country: { type: String, required: true },
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
		},
		frontImgKey: { type: String, select: false },
		frontImage: { type: String, required: true },
		// backImg: { type: String },
		// sign: { type: String },
		verifyed: { type: Boolean, required: true, default: false },
	},
	{
		timestamps: true,
	}
);

digitalIdSchema.index({ fullName: 1 });
digitalIdSchema.index({ email: 1 });

const DigitalId = mongoose.model("digitalId", digitalIdSchema);

module.exports = DigitalId;
