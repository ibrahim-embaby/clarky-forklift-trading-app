const {
  getNotificationsCtrl,
  createNotificationCtrl,
  deleteNotificationsCtrl,
  readNotificationsCtrl,
} = require("../controllers/notificationController");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");

const router = require("express").Router();

// /api/v1/notifications/
router
  .route("/")
  .get(verifyToken, getNotificationsCtrl)
  .post(verifyTokenAndAdmin, createNotificationCtrl)
  .put(verifyToken, readNotificationsCtrl);

router.route("/:userId").delete(verifyToken, deleteNotificationsCtrl);

module.exports = router;
