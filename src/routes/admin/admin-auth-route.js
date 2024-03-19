const express = require("express");
const {
	adminLoginValidation,
} = require("../../validator/admin/admin-validation");
const { loginAdmin } = require("../../controllers/admin/admin-auth-controller");

const router = express.Router();

router.use(express.json());

router.post("/auth/login", ...adminLoginValidation, loginAdmin);

module.exports = router;
