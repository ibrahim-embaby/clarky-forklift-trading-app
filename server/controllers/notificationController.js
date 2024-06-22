const asyncHandler = require("express-async-handler");
const { Notification } = require("../models/Notification");

/**
 * @desc create a notification
 * @route /api/v1/notifications
 * @method POST
 * @access private (only admin)
 */
module.exports.createNotificationCtrl = asyncHandler(async (req, res, next) => {
  try {
    const { receiverId, adId, type } = req.body;

    const notificationObj = {
      receiverId,
      adId,
      type,
      content:
        type === "adAccepted"
          ? { ar: "منشور", en: "Published" }
          : { ar: "مرفوض، انقر للمزيد", en: "Rejected, Click to see more" },
    };

    const notification = await Notification.create(notificationObj);
    res.status(201).json({
      status: "Success",
      message: "notification sent",
      data: notification,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc get user notifications
 * @route /api/v1/notifications
 * @method GET
 * @access private (only user him self)
 */
module.exports.getNotificationsCtrl = asyncHandler(async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const notifications = await Notification.find({ receiverId: req.user.id })
      .populate("adId", "_id title")
      .sort({ isRead: 1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const notificationsCount = await Notification.countDocuments({
      receiverId: req.user.id,
    });

    res.status(200).json({
      notificationsCount,
      notifications,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc read notifications
 * @route /api/v1/notifications/
 * @method PUT
 * @access private (only user him self)
 */
module.exports.readNotificationsCtrl = asyncHandler(async (req, res, next) => {
  try {
    const { notificationIds } = req.body;
    await Notification.updateMany(
      { _id: { $in: notificationIds }, receiverId: req.user.id },
      { $set: { isRead: true } },
      { new: true }
    );
    return res.status(200).json({ message: "Success", success: true });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc delete read notifications
 * @route /api/v1/notifications/:userId
 * @method DELETE
 * @access private (only user him self)
 */
module.exports.deleteNotificationsCtrl = asyncHandler(
  async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  }
);

// const cron = require("node-cron");
// const Notification = require("./models/Notification");

// // Schedule a cron job to run every day at midnight
// cron.schedule("0 0 * * *", async () => {
//   try {
//     // Delete notifications that are read and older than 30 days
//     await Notification.deleteMany({
//       isRead: true,
//       createdAt: { $lt: new Date(Date.now() - 30*24*60*60*1000) } // 30 days
//     });
//     console.log("Old read notifications deleted");
//   } catch (error) {
//     console.error("Error deleting old notifications:", error);
//   }
// });
