const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];

const corsOptions = {
	origin: (origin, callback) => {
		callback(null, true);
	},
	credentials: true,
	// optionsSuccessStatus: 200,
	// methods: ["POST", "PUT", "PATCH", "GET", "OPTIONS", "HEAD", "DELETE"],
	// exposedHeaders: ["set-cookie"],
};

if (process.env.NODE_ENV === "production") {
	console.log("hear");
	corsOptions.origin = (origin, callback) => {
		if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback(null, true);
			// callback(new Error("Not allowed by CORS"));
		}
	};
}

module.exports = corsOptions;
