const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { genrateOtp } = require("../utils");

const userSchema = new mongoose.Schema(
	{
		fullName: { type: String },
		userName: { type: String, required: true },
		countryCode: { type: String, required: true },
		phoneNo: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true, select: false },
		roles: { type: [String], default: ["User"] },
		verified: { type: Boolean, default: false },
		aggreTermsAndConditions: { type: String, default: false },
		profilePic: { type: String },
		profilePicKey: { type: String, select: false },
		// verificationCode: { type: String, select: false },
		// passwordResetToken: { type: String, select: false },
		// passwordResetAt: { type: Date, select: false },
	},
	{
		timestamps: true,
	}
);

userSchema.index({ email: -1 });

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return;

	this.password = await bcrypt.hash(this.password, 12);
	next();
});

userSchema.methods.comparePasswords = async function (userPassword) {
	return await bcrypt.compare(userPassword, this.password);
};

// Method to create verificationcode
userSchema.methods.createVerificationCode = function () {
	// const verificationCode = crypto.randomBytes(32).toString("hex");
	// this.verificationCode = crypto
	// 	.createHash("sha256")
	// 	.update(verificationCode)
	// 	.digest("hex");
	const verificationCode = genrateOtp();
	return verificationCode;
};

// Method to create reset token
userSchema.methods.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString("hex");
	this.passwordResetToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");
	this.passwordResetAt = new Date(Date.now() + 10 * 60 * 1000);
	return resetToken;
};

const User = mongoose.model("user", userSchema);

module.exports = User;
