const router = require("express").Router();
const {
  createAdCtrl,
  getAllUserAdsCtrl,
  getSingleAdCtrl,
  updateSingleAdCtrl,
  deleteSingleAdCtrl,
  getAllAdsCtrl,
} = require("../controllers/adController");
const { verifyToken } = require("../middlewares/verifyToken");

// /api/v1/ads
router.route("/").post(verifyToken, createAdCtrl).get(getAllAdsCtrl);

// /api/v1/ads/user/:userId
router.route("/user/:userId").get(getAllUserAdsCtrl);

// /api/v1/ads/:adId
router
  .route("/:adId")
  .get(getSingleAdCtrl)
  .put(verifyToken, updateSingleAdCtrl)
  .delete(verifyToken, deleteSingleAdCtrl);

module.exports = router;
