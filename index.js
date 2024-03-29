require("dotenv").config();
require("express-async-errors");

const { StatusCodes } = require("http-status-codes");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const { logger, logEvents } = require("./src/middleware/logger");
const corsOptions = require("./src/config/corsOptions");
const errorHandler = require("./src/middleware/errorHandler");
const {
	connectDB,
	connectRedis,
	redisInstance,
} = require("./src/config/connectDb");

//imports routes
const authRoutes = require("./src/routes/authRoutes");
const docsRoutes = require("./src/routes/userDocsRoutes");
const categoryRoutes = require("./src/routes/category-routes");
const notificationRoutes = require("./src/routes/user-notification-routes");
const propertyRoutes = require("./src/routes/property-routes");
const marketPlaceRoutes = require("./src/routes/marketplace-routes");

//admin routes
const adminAuthRoutes = require("./src/routes/admin/admin-auth-route");
const adminCatgoryRoutes = require("./src/routes/admin/admin-category-route");
const adminDocsRoutes = require("./src/routes/admin/admin-doc-routes");
const adminPropertyRoutes = require("./src/routes/admin/admin-property-routes");

const app = express();
const PORT = process.env.PORT || 4000;

console.log(process.env.NODE_ENV);

connectDB();
// connectRedis();
app.set("trust proxy", 1);

// app.use(logger);

console.log("corsOptions", corsOptions);

app.use(cors(corsOptions));
app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "public")));

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", docsRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/notification", notificationRoutes);
app.use("/api/v1/property", propertyRoutes);
app.use("/api/v1/market", marketPlaceRoutes);

//admin
app.use("/api/v1/admin", adminAuthRoutes);
app.use("/api/v1/admin/category", adminCatgoryRoutes);
app.use("/api/v1/admin/docs", adminDocsRoutes);
app.use("/api/v1/admin/property", adminPropertyRoutes);

// app.get("/api/v1/", async (req, res) => {
// 	const record = await DrivingLicence.find();
// 	res.status(200).json({
// 		success: true,
// 		data: record,
// 	});
// });

//end routes
app.all("*", (req, res) => {
	res.status(StatusCodes.NOT_FOUND);
	if (req.accepts("html")) {
		res.sendFile(path.join(__dirname, "src", "views", "404.html"));
	} else if (req.accepts("json")) {
		res.json({ message: "404 Not Found" });
	} else {
		res.type("txt").send("404 Not Found");
	}
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
	console.log("Connected to MongoDB");
	app.listen(PORT, () => {
		console.log(`server running on port ${PORT}`);
	});
});

mongoose.connection.on("error", (err) => {
	console.log(err);
	logEvents(
		`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
		"mongoErrLog.log"
	);
});

redisInstance.on("error", (err) => console.log("err", err));
