const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../utils/ErrorResponse");
const { Ad } = require("../models/Ad");

/**
 * @desc get ads
 * @route /api/v1/admin/ads/
 * @method GET
 * @access public
 */
module.exports.getAdminAdsCtrl = asyncHandler(async (req, res, next) => {
  try {
    const { adStatus, page } = req.query;
    const pageSize = 10;
    const currentPage = parseInt(page, 10) || 1;
    const skip = (currentPage - 1) * pageSize;
    let count;

    const ads = await Ad.find({ adStatus })
      .populate("userId", "username  _id")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    count = await Ad.countDocuments({ adStatus });
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
module.exports.getAdminAdsCountCtrl = asyncHandler(async (req, res, next) => {
  try {
    const { adStatus } = req.query;

    const adsCount = await Ad.find({ adStatus }).count();

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
// TODO: delete all photos of the ad from cloudinary
module.exports.adminAcceptRefuseAdCtrl = asyncHandler(
  async (req, res, next) => {
    try {
      const { adId } = req.params;

      const ad = await Ad.findById(adId);
      if (!ad) return next(new ErrorResponse(req.t("ad_not_found"), 404));

      if (req.user.role !== "admin") {
        return next(new ErrorResponse(req.t("forbidden"), 301));
      }

      const acceptedAd = await Ad.findByIdAndUpdate(
        adId,
        { adStatus: req.body.adStatus },
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
