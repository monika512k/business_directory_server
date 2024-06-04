const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");





// category 
router.post(
  '/getAllCategory',
  categoryController.getAllCategory
)
// category 

module.exports = router;
