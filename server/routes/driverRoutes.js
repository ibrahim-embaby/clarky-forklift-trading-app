const {
  createDriverCtrl,
  getSingleDriverCtrl,
  updateDriverCtrl,
  deleteDriverCtrl,
  getDriversCtrl,
} = require("../controllers/driverController");
const validateObjectId = require("../middlewares/validateObjectId");
const { verifyToken } = require("../middlewares/verifyToken");

const router = require("express").Router();

// /api/v1/drivers/
router.route("/").post(verifyToken, createDriverCtrl).get(getDriversCtrl);

// /api/v1/drivers/:id
router
  .route("/:id")
  .get(validateObjectId, getSingleDriverCtrl)
  .put(validateObjectId, verifyToken, updateDriverCtrl)
  .delete(validateObjectId, verifyToken, deleteDriverCtrl);

module.exports = router;
