const mongoose = require("mongoose");

const drivingLicenceSchema = new mongoose.Schema(
	{
		fullName: { type: String, required: [true, "fullName is required"] },
		customerId: {
			type: String,
			required: [true, "customerId is required"],
		},
		dob: { type: Date, required: true },
		gender: { type: String, required: true },
		address: { type: String, required: true },
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
		},
		frontImgKey: { type: String, select: false },
		frontImage: { type: String },
		// backImage: { type: String },
		verifyed: { type: Boolean, required: true, default: false },
	},
	{
		timestamps: true,
	}
);

drivingLicenceSchema.index({ fullName: 1, customerId: 1 });

const DrivingLicence = mongoose.model("drivingLicense", drivingLicenceSchema);

module.exports = DrivingLicence;
