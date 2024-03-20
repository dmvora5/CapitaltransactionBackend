const {
	S3Client,
	GetObjectCommand,
	DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const { v4: uuidv4 } = require("uuid");
const otpGenerator = require("otp-generator");
const { logEvents } = require("../middleware/logger");

const s3Client = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_S3_ACCESS_KEY,
		secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
	},
});

exports.getPaginationDetails = (reqQuery) => {
	const page = Number(reqQuery.page) || 1;
	const limit = Number(reqQuery.limit) || 9;
	const skip = (page - 1) * limit;
	return {
		page,
		limit,
		skip,
	};
};

//TODO: remove after
exports.encode = (data) => {
	let buf = Buffer.from(data);
	let base64 = buf.toString("base64");
	return base64;
};

exports.uploadImages = async ({ req, bucketName, keyName }) => {
	const uploadPromises = {};

	// Group upload promises by field name
	for (const file of req.files || []) {
		const fieldname = file.fieldname.replace(/\[\]/g, "");
		const key = `${keyName}/${fieldname}/${uuidv4()}-${Date.now()}`;

		const uploadParams = {
			Bucket: bucketName,
			Key: key,
			Body: file.buffer,
			ContentType: file.mimetype,
		};

		const upload = new Upload({
			client: s3Client,
			params: uploadParams,
		});

		if (!uploadPromises[fieldname]) {
			uploadPromises[fieldname] = [];
		}

		uploadPromises[fieldname].push(
			upload.done().then(({ Key, Location }) => ({
				field: fieldname,
				key: Key,
				location: Location,
			}))
		);
	}

	const result = {};

	// Wait for all upload promises to settle for each field
	await Promise.allSettled(
		Object.entries(uploadPromises).map(async ([fieldName, promises]) => {
			result[fieldName] = [];

			const settledPromises = await Promise.allSettled(promises);
			settledPromises.forEach(({ status, value }) => {
				if (status === "fulfilled") {
					result[fieldName].push(value);
				}
			});
		})
	);

	return result;
};

exports.getImagesFromAWS = async ({ bucketName, keyName }) => {
	if (!keyName) return null;
	const downloadParams = {
		Bucket: bucketName,
		Key: keyName,
	};
	try {
		const downloadCommand = new GetObjectCommand(downloadParams);
		const { Body, ContentType } = await s3Client.send(downloadCommand);
		const uintarry = await Body.transformToByteArray();
		const bufferData = Buffer.from(uintarry);
		const base64ImageData = bufferData.toString("base64");
		const dataUrl = `data:${ContentType};base64,${base64ImageData}`;
		return dataUrl;
	} catch (error) {
		console.error("Error fetching image from AWS:", error);
		throw error;
	}
};

exports.deleteImagesFromAWS = async ({ bucketName, keyName }) => {
	const deleteParams = {
		Bucket: bucketName,
		Key: keyName,
	};
	try {
		await s3Client.send(new DeleteObjectCommand(deleteParams));
	} catch (err) {
		logEvents(`${err.name}: ${err.message}\t`, "awss3.log");
		console.log("err", err);
	}
};
exports.genrateOtp = (size = 4) => {
	return otpGenerator.generate(size, {
		upperCaseAlphabets: false,
		lowerCaseAlphabets: false,
		specialChars: false,
	});
};

// async function streamToBase64(stream) {
// 	return new Promise((resolve, reject) => {
// 		const chunks = [];
// 		stream.on("data", (chunk) => {
// 			chunks.push(chunk);
// 		});
// 		stream.on("end", () => {
// 			const buffer = Buffer.concat(chunks);
// 			resolve(buffer.toString("base64"));
// 		});
// 		stream.on("error", (error) => {
// 			reject(error);
// 		});
// 	});
// }
