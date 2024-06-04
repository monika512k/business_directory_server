const express = require("express");
const router = express.Router();
const authMiddleWare = require("../middleware/auth");
const authController = require("../controllers/authController");


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

// authMiddleWare.version, 
router.post(
    "/login",
    authController.login
  )
  router.post(
    "/register",
    authController.register
)

router.post(
  "/change-password",
  authMiddleWare.authenticateToken,
  authController.changePassword
);
router.get(
  "/view-profile",
  authMiddleWare.authenticateToken,
  authController.viewProfile
);

router.post(
  "/update-profile",
  upload.single("profile_image"),
  authMiddleWare.authenticateToken,
  authController.updateInfo
);
router.post(
  "/forgot-password",
  authController.forgotPassword
);





// order end 
module.exports = router;
