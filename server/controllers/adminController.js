const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../utils/ErrorResponse");
const { Ad } = require("../models/Ad");
const { AdStatus } = require("../models/AdStatus");
const { User } = require("../models/User");

/**
 * @desc get ads
 * @route /api/v1/admin/ads/
 * @method GET
 * @access public
 */
module.exports.adminGetAdsCtrl = asyncHandler(async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const ads = await Ad.find({ adStatus: req.query.adStatus })
      .populate("userId", "username  _id")
      .sort({ createdAt: -1 })
      .skip(page * pageSize)
      .limit(pageSize);

    count = await Ad.countDocuments({ adStatus: req.query.adStatus });
    res.status(200).json({ ads, count });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc get ads
 * @route /api/v1/admin/ads/count/
 * @method GET
 * @access public
 */
module.exports.adminGetAdsCountCtrl = asyncHandler(async (req, res, next) => {
  try {
    const adStatus = await AdStatus.findOne({ value: req.query.adStatus });

    const adsCount = await Ad.find({ adStatus: adStatus._id }).count();

    res.status(200).json({ count: adsCount });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc accept ad
 * @route /api/v1/admin/ads/:adId
 * @method PUT
 * @access private (only admin)
 */
module.exports.adminAcceptRefuseAdCtrl = asyncHandler(
  async (req, res, next) => {
    try {
      const { adId } = req.params;

      const ad = await Ad.findById(adId);
      if (!ad) return next(new ErrorResponse(req.t("ad_not_found"), 404));

      const adStatus = await AdStatus.findOne({ value: req.body.adStatus });

      const acceptedAd = await Ad.findByIdAndUpdate(
        adId,
        {
          adStatus: adStatus._id.toString(),
          rejectionReason: req.body.rejectionReason,
        },
        { new: true }
      );

      res.status(200).json({
        success: true,
        data: acceptedAd,
        message:
          req.body.adStatus === "published"
            ? req.t("ad_accepted")
            : req.t("ad_refused"),
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @desc get all user
 * @route /api/v1/admin/users
 * @method GET
 * @access private ( admin)
 */
module.exports.adminGetUsersCtrl = asyncHandler(async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const totalUsers = await User.countDocuments();
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(page * pageSize)
      .limit(pageSize);

    if (!users) {
      return res.status(404).json({ message: req.t("no_users") });
    }

    res.status(200).json({ users, totalUsers });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc get all statistics
 * @route /api/v1/admin/statistics
 * @method GET
 * @access private ( admin)
 */
module.exports.adminGetStatisticsCtrl = asyncHandler(async (req, res, next) => {
  try {
    const usersCount = await User.countDocuments();

    const puplishedStatus = await AdStatus.findOne({ value: "published" });
    const publsihedAdsCount = await Ad.countDocuments({
      adStatus: puplishedStatus._id,
    });

    const pendingStatus = await AdStatus.findOne({ value: "pending" });
    const pendingAdsCount = await Ad.countDocuments({
      adStatus: pendingStatus._id,
    });

    const rejectedStatus = await AdStatus.findOne({ value: "rejected" });
    const rejectedAdsCount = await Ad.countDocuments({
      adStatus: rejectedStatus._id,
    });

    res.status(200).json({
      usersCount,
      pendingAdsCount,
      publsihedAdsCount,
      rejectedAdsCount,
    });
  } catch (error) {
    next(error);
  }
});
