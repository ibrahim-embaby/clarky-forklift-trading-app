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
  addAdStatusCtrl,
  getAdStatusCtrl,
} = require("../controllers/controlsController");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

const router = require("express").Router();

// PROVINCE ROUTES

// /api/v1/controls/provinces
router
  .route("/provinces")
  .post(verifyTokenAndAdmin, addProvinceCtrl)
  .get(getProvincesCtrl);

// /api/v1/controls/provinces/:id
router.route("/province/:id").get(getSingleProvinceCtrl);

// /api/v1/controls/cities
router.route("/cities").post(verifyTokenAndAdmin, addCityCtrl);

// STATUS ROUTES
// /api/v1/controls/statuses
router
  .route("/statuses")
  .post(verifyTokenAndAdmin, addStatusCtrl)
  .get(getStatusCtrl);

// ITEM TYPE ROUTES
// /api/v1/controls/item-types
router
  .route("/item-types")
  .post(verifyTokenAndAdmin, addItemTypeCtrl)
  .get(getItemTypeCtrl);

// AD TARGET ROUTES
// /api/v1/controls/ad-targets
router
  .route("/ad-targets")
  .post(verifyTokenAndAdmin, addAdTargetCtrl)
  .get(getAdTargetCtrl);

// AD STATUS ROUTES
// /api/v1/controls/ad-statuses
router
  .route("/ad-statuses")
  .post(verifyTokenAndAdmin, addAdStatusCtrl)
  .get(getAdStatusCtrl);

module.exports = router;
