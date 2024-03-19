const mongoose = require("mongoose");

const passportSchema = new mongoose.Schema(
	{
		fullName: { type: String, required: true },
		nationality: { type: String, required: true },
		dob: { type: Date, required: true },
		gender: { type: String, required: true },
		passportNo: { type: String, required: true },
		country: { type: String, required: true },
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
		},
		frontImage: { type: String, required: true },
		frontImgKey: { type: String, select: false },
		backImage: { type: String },
		verifyed: { type: Boolean, required: true, default: false },
	},
	{
		timestamps: true,
	}
);

passportSchema.index({ fullName: 1 });

const Passport = mongoose.model("passport", passportSchema);

module.exports = Passport;
