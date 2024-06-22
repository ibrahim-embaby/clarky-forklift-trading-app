const {
  getUserCtrl,
  deleteUserCtrl,
  updateUserCtrl,
  getMyAdsCtrl,
  getMyAdCtrl,
} = require("../controllers/userController");
const validateObjectId = require("../middlewares/validateObjectId");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");

const router = require("express").Router();

// /api/user/profile/:id
router
  .route("/profile/:id")
  .get(validateObjectId, verifyToken, getUserCtrl)
  .delete(validateObjectId, verifyTokenAndAdmin, deleteUserCtrl);

// /api/user/profile/
router.route("/profile/").put(verifyToken, updateUserCtrl);

// /api/v1/user/:userId/profile/ads
router.get("/:userId/profile/ads", verifyToken, getMyAdsCtrl);

// /api/v1/user/:userId/profile/ads/:adId
router.get("/:userId/profile/ads/:adId", verifyToken, getMyAdCtrl);

module.exports = router;
