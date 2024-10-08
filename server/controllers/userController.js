const asyncHandler = require("express-async-handler");
const { User, validateUpdateUser } = require("../models/User");
const { Ad } = require("../models/Ad");
const ErrorResponse = require("../utils/ErrorResponse");
const { Notification } = require("../models/Notification");
const { Driver } = require("../models/Driver");
const logger = require("../config/logger");
const cloudinary = require("cloudinary").v2;

/**
 * @desc get user profile
 * @route /api/user/profile/:id
 * @method GET
 * @access private (logged user & admin)
 */
module.exports.getUserCtrl = asyncHandler(async (req, res) => {
  logger.info("started getUserCtrl");

  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: req.t("user_not_found") });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

/**
 * @desc get user ads
 * @route /api/user/:userId/profile/ads
 * @method GET
 * @access public
 */
module.exports.getMyAdsCtrl = asyncHandler(async (req, res, next) => {
  logger.info("started getMyAdsCtrl");
  try {
    const { adStatus, page } = req.query;
    const pageSize = 12;
    const currentPage = parseInt(page, 10) || 1;
    const skip = (currentPage - 1) * pageSize;
    let count;

    const ads = await Ad.find({ userId: req.user.id, adStatus })
      .populate("province city")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    count = await Ad.countDocuments({ userId: req.user.id, adStatus });
    res.status(200).json({ ads, count });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc get user ads
 * @route /api/user/:userId/profile/ads/:adId
 * @method GET
 * @access public
 */
module.exports.getMyAdCtrl = asyncHandler(async (req, res, next) => {
  logger.info("started getMyAdCtrl");
  try {
    const ad = await Ad.findOne({
      _id: req.params.adId,
      userId: req.user.id,
    }).populate("userId province city status saleOrRent adStatus itemType");

    res.status(200).json({
      success: true,
      data: ad,
      message: "Success",
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc delete single user
 * @route /api/user/profile/:id
 * @method DELETE
 * @access private ( user himslef & admin)
 */
module.exports.deleteUserCtrl = asyncHandler(async (req, res, next) => {
  logger.info("started deleteUserCtrl");
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return next(new ErrorResponse(req.t("user_not_found"), 404));
    }

    // Collect public_ids to delete from Cloudinary
    const publicIdsToDelete = [];

    if (user.profilePhoto?.public_id) {
      publicIdsToDelete.push(user.profilePhoto.public_id);
    }

    const userAds = await Ad.find({ userId: id });
    userAds.forEach((ad) => {
      const adPhotoPublicIds = ad.photos.map((photoUrl) => {
        return photoUrl.split("/").slice(-2).join("/").split(".")[0];
      });
      publicIdsToDelete.push(...adPhotoPublicIds);
    });

    // Delete Cloudinary objects if there are any
    if (publicIdsToDelete.length > 0) {
      const deletePromises = publicIdsToDelete.map((public_id) =>
        cloudinary.uploader.destroy(public_id)
      );
      await Promise.all(deletePromises);
    }

    // Delete ads
    await Ad.deleteMany({ userId: id });

    // Delete user
    await User.findByIdAndDelete(id);

    // Delete driver data if found
    const driver = await Driver.findOne({ userId: id });
    if (driver?.photo?.public_id) {
      await cloudinary.uploader.destroy(driver.photo.public_id);
    }
    await Driver.findOneAndDelete({ userId: id });

    // Delete User Notifications
    await Notification.deleteMany({ receiverId: id });

    res.status(200).json({ message: req.t("user_deleted") });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc update user data
 * @route /api/user/profile/
 * @method PUT
 * @access private ( user himslef )
 */
module.exports.updateUserCtrl = asyncHandler(async (req, res, next) => {
  logger.info("started updateUserCtrl");
  try {
    const { error } = validateUpdateUser(req.body);
    if (error) {
      return next(new ErrorResponse(error.details[0].message, 400));
    }
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorResponse(req.t("user_not_found"), 404));
    }

    // Delete the old profile photo from Cloudinary if a new one is provided
    if (req.body.profilePhoto && user.profilePhoto?.public_id) {
      await cloudinary.uploader.destroy(user.profilePhoto.public_id);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    });

    const { accessToken } = updatedUser.getSignedToken();
    res.status(200).json({
      success: true,
      data: {
        id: updatedUser._id,
        token: accessToken,
        email: updatedUser.email,
        role: updatedUser.role,
        username: updatedUser.username,
        mobile: updatedUser.mobile,
        profilePhoto: updatedUser.profilePhoto,
        bio: updatedUser.bio,
        isAccountVerified: updatedUser.isAccountVerified,
      },
      message: req.t("data_updated"),
    });
  } catch (error) {
    next(error);
  }
});
