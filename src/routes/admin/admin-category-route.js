const express = require("express");
const {
	idValidation,
	createCategoryValidation,
	updateCategoryValidation,
} = require("../../validator/category-validation");
const {
	getCategory,
	createCategory,
	updateCategory,
	deleteCategory,
} = require("../../controllers/admin/admin-category-controller");
const {
	deserializeUser,
	requiredUser,
	restrictTo,
} = require("../../middleware/deserializeUser");

const router = express.Router();

router.use(express.json());

router.use(deserializeUser);
router.use(requiredUser);
router.use(restrictTo("Admin"));

router.get("/:id", ...idValidation, getCategory);
router.post("/", ...createCategoryValidation, createCategory);
router.patch("/:id", ...updateCategoryValidation, updateCategory);
router.delete("/:id", ...idValidation, deleteCategory);

module.exports = router;
