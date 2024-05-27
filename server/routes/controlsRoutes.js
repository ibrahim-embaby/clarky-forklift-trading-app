const {
  addProvinceCtrl,
  getProvincesCtrl,
  addCityCtrl,
  getSingleProvinceCtrl,
  addStatusCtrl,
  addItemTypeCtrl,
  getItemTypeCtrl,
  getStatusCtrl,
  addAdTargetCtrl,
  getAdTargetCtrl,
} = require("../controllers/controlsController");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

const router = require("express").Router();

// PROVINCE ROUTES

// /api/controls/provinces
router
  .route("/provinces")
  .post(verifyTokenAndAdmin, addProvinceCtrl)
  .get(getProvincesCtrl);

// /api/controls/provinces/:id
router.route("/province/:id").get(getSingleProvinceCtrl);

// /api/controls/cities
router.route("/cities").post(verifyTokenAndAdmin, addCityCtrl);

// STATUS ROUTES
// /api/controls/statuses
router
  .route("/statuses")
  .post(verifyTokenAndAdmin, addStatusCtrl)
  .get(getStatusCtrl);

// ITEM TYPE ROUTES
// /api/controls/item-types
router
  .route("/item-types")
  .post(verifyTokenAndAdmin, addItemTypeCtrl)
  .get(getItemTypeCtrl);

// AD TARGET ROUTES
// /api/controls/ad-targets
router
  .route("/ad-targets")
  .post(verifyTokenAndAdmin, addAdTargetCtrl)
  .get(getAdTargetCtrl);

module.exports = router;
