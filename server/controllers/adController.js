const asyncHandler = require("express-async-handler");
const { validateCreateAd, Ad, validateUpdateAd } = require("../models/Ad");
const ErrorResponse = require("../utils/ErrorResponse");
const { AdStatus } = require("../models/AdStatus");
const jwt = require("jsonwebtoken");
const S3 = require("aws-sdk/clients/s3");
const s3 = new S3({
  region: process.env.AWS_S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_IAM_ACCESS_KEY,
    secretAccessKey: process.env.AWS_IAM_SECRET_ACCESS_KEY,
  },
});

/**
 * @desc create ad
 * @route /api/ads/
 * @method POST
 * @access private (logged user only)
 */
module.exports.createAdCtrl = asyncHandler(async (req, res, next) => {
  try {
    const { error } = validateCreateAd(req.body);
    if (error) return next(new ErrorResponse(error.details[0].message, 400));

    const newAd = await Ad.create({
      userId: req.user.id,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      data: newAd,
      message: req.t("ad_created"),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc get ads
 * @route /api/v1/ads/
 * @method GET
 * @access public
 */
module.exports.getAllAdsCtrl = asyncHandler(async (req, res, next) => {
  try {
    const { province, status, itemType, search, page } = req.query;
    const pageSize = 12;
    const currentPage = parseInt(page, 10) || 1;
    const skip = (currentPage - 1) * pageSize;
    let count;

    const publishedStatus = await AdStatus.find({ value: "published" });
    const query = {
      adStatus: publishedStatus,
    };

    if (province) query["province"] = province;
    if (status) query["status"] = status;
    if (itemType) query["itemType"] = itemType;
    if (search) {
      const regex = { $regex: search, $options: "i" };
      query["$or"] = [{ title: regex }, { description: regex }];
    }

    const ads = await Ad.find(query)
      .populate("userId", "username  _id")
      .populate("province city")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    count = await Ad.countDocuments(query);
    res.status(200).json({ ads, count });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc get all user ads
 * @route /api/ads/users/:userId
 * @method GET
 * @access public
 */
module.exports.getAllUserAdsCtrl = asyncHandler(async (req, res, next) => {
  try {
    const { userId } = req.params;
    const publishedStatus = await AdStatus.findOne({ value: "published" });

    const ads = await Ad.find({ userId, adStatus: publishedStatus })
      .populate("userId", "username  _id")
      .populate("province city")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(ads);
  } catch (error) {
    next(error);
  }
});

/**
 * @desc get single ad
 * @route /api/ads/:adId
 * @method GET
 * @access public
 */
module.exports.getSingleAdCtrl = asyncHandler(async (req, res, next) => {
  try {
    const { adId } = req.params;
    const publishedStatus = await AdStatus.findOne({ value: "published" });

    const token = req.headers?.authorization?.split(" ")[1];

    let user = null;

    if (token) {
      try {
        user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      } catch (error) {
        return next(new ErrorResponse("دخول غير مسموح1", 401));
      }
    }

    let ad;

    if (user) {
      ad = await Ad.findOne({
        _id: adId,
        $or: [{ userId: user.id }, { adStatus: publishedStatus }],
      })
        .populate("userId", "username  _id bio profilePhoto")
        .populate("province city status saleOrRent adStatus itemType");
    } else {
      ad = await Ad.findOne({
        _id: adId,
        adStatus: publishedStatus,
      })
        .populate("userId", "username  _id bio profilePhoto")
        .populate("province city status saleOrRent adStatus itemType");
    }

    if (!ad) {
      return next(new ErrorResponse(req.t("ad_not_found"), 404));
    }

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
 * @desc update ad
 * @route /api/ads/:adId
 * @method PUT
 * @access private (only user himself)
 */
module.exports.updateSingleAdCtrl = asyncHandler(async (req, res, next) => {
  try {
    const { error } = validateUpdateAd(req.body);
    if (error) return next(new ErrorResponse(error.details[0].message, 400));

    const { adId } = req.params;

    const ad = await Ad.findById(adId);
    if (!ad) return next(new ErrorResponse(req.t("ad_not_found"), 404));

    if (ad.userId.toString() !== req.user.id) {
      return next(new ErrorResponse(req.t("forbidden"), 301));
    }

    // Identify deleted photos
    const newPhotos = req.body.photos || [];
    const oldPhotos = ad.photos || [];

    const photosToDelete = oldPhotos.filter(
      (photo) => !newPhotos.includes(photo)
    );

    // Delete photos from S3
    if (photosToDelete.length > 0) {
      const deleteParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Delete: {
          Objects: photosToDelete.map((url) => ({
            Key: url.split(".com/")[1], // Extract the key from the URL
          })),
        },
      };

      await s3.deleteObjects(deleteParams).promise();
    }

    const pendingStatus = await AdStatus.findOne({ value: "pending" });

    const updatedAd = await Ad.findByIdAndUpdate(
      adId,
      { ...req.body, adStatus: pendingStatus._id },
      { new: true }
    )
      .populate("userId", "username  _id")
      .populate("province city status saleOrRent adStatus");

    res
      .status(200)
      .json({ success: true, data: updatedAd, message: req.t("ad_edit") });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc delete ad
 * @route /api/ads/:adId
 * @method DELETE
 * @access private (only admin and user himself)
 */
module.exports.deleteSingleAdCtrl = asyncHandler(async (req, res, next) => {
  try {
    const { adId } = req.params;

    const ad = await Ad.findById(adId);
    if (!ad) return next(new ErrorResponse(req.t("ad_not_found"), 404));

    if (ad.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new ErrorResponse(req.t("forbidden"), 301));
    }
    // Extract the S3 keys from the ad's photos
    const objectsToDelete = ad.photos.map((photoUrl) => {
      // Extract the key from the photo URL
      const urlParts = photoUrl.split("/");
      const key = urlParts.slice(3).join("/");
      return { Key: key };
    });

    // Delete the images from S3
    if (objectsToDelete.length > 0) {
      await s3
        .deleteObjects({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Delete: {
            Objects: objectsToDelete,
            Quiet: false, // If you want to receive info about each object deleted
          },
        })
        .promise();
    }

    const deletedAd = await Ad.findByIdAndDelete(adId);

    res
      .status(200)
      .json({ success: true, data: deletedAd, message: req.t("ad_deleted") });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc view ad
 * @route /api/ads/:adId/views
 * @method PUT
 * @access public
 */
// TODO
module.exports.viewAdCtrl = asyncHandler(async (req, res, next) => {
  try {
    const { adId } = req.params;
    const ad = await Ad.findById(adId);
    if (!ad) return res.status(404).json({ message: req.t("ad_not_found") });
    const likedAd = await Ad.findOneAndUpdate(
      { _id: adId, likedBy: { $nin: req.user.id } },
      { $push: { likedBy: req.user.id }, $inc: { likes: 1 } },
      { new: true }
    );
    if (!likedAd)
      return res.status(403).json({ message: req.t("liked_already") });
    res.status(200).json({ data: likedAd, message: req.t("success") });
  } catch (error) {
    next(error);
  }
});
