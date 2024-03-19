const express = require("express");

const {
	registerUserValidation,
	loginValidation,
	forgetPasswordValidation,
	resetPasswordValidation,
	verifyEmailValidation,
	changePasswordValidation,
} = require("../validator/user-validation");
const {
	createUser,
	loginUser,
	verifyEmail,
	refreshAccessToken,
	logoutUser,
	forgetPassword,
	resetPassword,
	resend,
	getUserDetails,
	updateUser,
	updatePassword,
} = require("../controllers/authController");
const loginLimiter = require("../middleware/loginLimiter");
const {
	deserializeUser,
	requiredUser,
} = require("../middleware/deserializeUser");
const multer = require("multer");

const router = express.Router();

router.use(express.json());

router.post("/register", ...registerUserValidation, createUser);
router.post("/login", ...loginValidation, loginLimiter, loginUser);
router.post("/forget-password", ...forgetPasswordValidation, forgetPassword);
router.post("/reset-password/", ...resetPasswordValidation, resetPassword);
router.post("/resend-otp", ...forgetPasswordValidation, resend);

router.post("/verifyemail", ...verifyEmailValidation, verifyEmail);
router.get("/refresh", refreshAccessToken);
router.post("/logout", logoutUser);

router.get("/user-details", deserializeUser, requiredUser, getUserDetails);

router.patch("/", deserializeUser, requiredUser, multer().any(), updateUser);
router.patch(
	"/change-password",
	deserializeUser,
	requiredUser,
	...changePasswordValidation,
	updatePassword
);

module.exports = router;
