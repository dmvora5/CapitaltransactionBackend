const express = require("express");
const { getAllCategory } = require("../controllers/category-controller");

const router = express.Router();

router.use(express.json());

router.get("/", getAllCategory);

module.exports = router;
