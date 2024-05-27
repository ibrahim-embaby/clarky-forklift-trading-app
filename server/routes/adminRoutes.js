const router = require("express").Router();
const {
  getAdminAdsCtrl,
  getAdminAdsCountCtrl,
  adminAcceptRefuseAdCtrl,
} = require("../controllers/adminController");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

// /api/v1/admin/ads
router
  .route("/ads")
  .get(verifyTokenAndAdmin, getAdminAdsCtrl)
  .put(verifyTokenAndAdmin, adminAcceptRefuseAdCtrl);

// /api/v1/admin/ads/count
router.route("/ads/count").get(verifyTokenAndAdmin, getAdminAdsCountCtrl);

// /api/v1/admin/ads/:adId
router.route("/ads/:adId").put(verifyTokenAndAdmin, adminAcceptRefuseAdCtrl);

module.exports = router;
