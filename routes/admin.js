const express = require("express");
const router = express.Router();
const adminAuthController= require("../controllers/admin/authController");
const categoryController = require('../controllers/admin/categoryController');

const adminAuthMiddleware = require("../middleware/auth");
const userController = require("../controllers/admin/userController");


// image upload
const multer = require("multer");

//Setting storage engine
const storageEngine = multer.diskStorage({
  destination: "./images",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});
//initializing multer
const upload = multer({
  storage: storageEngine,
});

////category start
router.post(
  "/adminLogin",
  adminAuthController.adminLogin
)
router.post(
  "/companyProfile",
  adminAuthMiddleware.adminAuthentication,
  upload.single("logo"),
  adminAuthController.companyProfile
)
router.get(
'/viewCompanyProfile',
adminAuthMiddleware.adminAuthentication,
adminAuthController.viewCompanyProfile
)
router.post(
  "/changePassword",
  adminAuthMiddleware.adminAuthentication,
  adminAuthController.changePassword
)

router.post(
  "/addCategory",
  upload.single("image"),
  adminAuthMiddleware.adminAuthentication,
  categoryController.addCategory
);

router.post(
  "/getCategory",
  adminAuthMiddleware.adminAuthentication,
  categoryController.getAllCategory
);
router.delete(
  "/deleteCategory/:id",
  adminAuthMiddleware.adminAuthentication,
  categoryController.deleteCategory
);
router.post(
  "/updateCategory",
  upload.single("image"),
  adminAuthMiddleware.adminAuthentication,
  categoryController.updateCategory
);
////category end


// user 

router.post(
  '/getUserList',
  adminAuthMiddleware.adminAuthentication,
  userController.getAllUser
)

router.get(
  '/changesUserStatus/:id',
  adminAuthMiddleware.adminAuthentication,
  userController.changesUserStatus
)
// user



module.exports = router;
