const router = require("express").Router();
const {
  adminAcceptRefuseAdCtrl,
  adminGetUsersCtrl,
  adminGetAdsCtrl,
  adminGetAdsCountCtrl,
  adminGetStatisticsCtrl,
  adminGetDriversCtrl,
  adminAcceptRejectDriverCtrl,
} = require("../controllers/adminController");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

// /api/v1/admin/ads
router.route("/ads").get(verifyTokenAndAdmin, adminGetAdsCtrl);

// /api/v1/admin/ads/count
router.route("/ads/count").get(verifyTokenAndAdmin, adminGetAdsCountCtrl);

// /api/v1/admin/ads/:adId
router.route("/ads/:adId").put(verifyTokenAndAdmin, adminAcceptRefuseAdCtrl);

// /api/v1/admin/users
router.route("/users").get(verifyTokenAndAdmin, adminGetUsersCtrl);

// /api/v1/admin/drivers
router.route("/drivers").get(verifyTokenAndAdmin, adminGetDriversCtrl);

// /api/v1/admin/drivers/:id
router
  .route("/drivers/:id")
  .put(verifyTokenAndAdmin, adminAcceptRejectDriverCtrl);

// /api/v1/admin/statistics
router.route("/statistics").get(verifyTokenAndAdmin, adminGetStatisticsCtrl);

module.exports = router;
