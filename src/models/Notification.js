const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
	view: { type: Boolean, required: true, default: false },
	title: { type: String, required: true },
	message: { type: String, required: true },
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

const Notification = mongoose.model("notification", notificationSchema);

module.exports = Notification;
