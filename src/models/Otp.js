const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
	{
		email: { type: String, required: true },
		otp: { type: String, required: true },
		// type: { type: String, required: true },
		createdAt: { type: Date, expires: 120, default: Date.now },
	},
	{
		timestamps: true,
	}
);

otpSchema.index({ email: 1, otp: 1, type: 1 });

const Otp = mongoose.model("otp", otpSchema);

module.exports = Otp;
