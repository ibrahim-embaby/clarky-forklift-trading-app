const asyncHandler = require("express-async-handler");
const { User, validateUpdateUser } = require("../models/User");
const bcrypt = require("bcrypt");
const { Ad } = require("../models/Ad");
const ErrorResponse = require("../utils/ErrorResponse");
const { AdStatus } = require("../models/AdStatus");
const S3 = require("aws-sdk/clients/s3");
const s3 = new S3({
  region: process.env.AWS_S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_IAM_ACCESS_KEY,
    secretAccessKey: process.env.AWS_IAM_SECRET_ACCESS_KEY,
  },
});

/**
 * @desc get user profile
 * @route /api/user/profile/:id
 * @method GET
 * @access private (logged user & admin)
 */
module.exports.getUserCtrl = asyncHandler(async (req, res) => {
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
  try {
    const { adStatus, page } = req.query;
    const pageSize = 12;
    const currentPage = parseInt(page, 10) || 1;
    const skip = (currentPage - 1) * pageSize;
    let count;

    const publishedStatus = await AdStatus.findOne({ value: "published" });
    if (
      adStatus !== publishedStatus._id.toString() &&
      req.user.id !== req.params.userId
    ) {
      return next(new ErrorResponse(req.t("forbidden"), 400));
    }

    const ads = await Ad.find({ userId: req.params.userId, adStatus })
      .populate("province city")
      .skip(skip)
      .limit(pageSize);

    count = await Ad.countDocuments({ userId: req.params.userId, adStatus });
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
 * @desc get all user
 * @route /api/user/profile/:id
 * @method GET
 * @access private ( admin)
 */
module.exports.getUsersCtrl = asyncHandler(async (req, res) => {
  const users = await User.find();
  if (!users) {
    return res.status(404).json({ message: req.t("no_users") });
  }
  res.status(200).json(users);
});

/**
 * @desc delete single user
 * @route /api/user/profile/:id
 * @method DELETE
 * @access private ( user himslef & admin)
 */
module.exports.deleteUserCtrl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: req.t("user_not_found") });
  }
  await User.findByIdAndDelete(id);
  await Ad.deleteMany({ userId: id });

  res.status(200).json({ message: req.t("user_deleted") });
});

/**
 * @desc update user data
 * @route /api/user/profile/
 * @method PUT
 * @access private ( user himslef )
 */
module.exports.updateUserCtrl = asyncHandler(async (req, res, next) => {
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

    if (req.body.profilePhoto) {
      await s3
        .deleteObject({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: user.profilePhoto.key,
        })
        .promise();
    }

    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    });

    const { accessToken } = updatedUser.getSignedToken();
    res.status(200).json({
      data: {
        id: updatedUser._id,
        token: accessToken,
        email: updatedUser.email,
        isAdmin: updatedUser.role,
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
