const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../utils/ErrorResponse");
const jwt = require("jsonwebtoken");
const {
  validateCreateDriver,
  Driver,
  validateUpdateDriver,
} = require("../models/Driver");
const logger = require("../config/logger");
const cloudinary = require("cloudinary").v2;

/**
 * @desc create driver
 * @route /api/v1/drivers/
 * @method POST
 * @access private (logged user only)
 */
module.exports.createDriverCtrl = asyncHandler(async (req, res, next) => {
  logger.info("started createDriverCtrl");

  const uploadedPhoto = req.body.photo ? req.body.photo.public_id : null;

  try {
    // Validation check
    const { error } = validateCreateDriver(req.body);
    if (error) {
      throw new ErrorResponse(error.details[0].message, 400);
    }

    // Check if the user has already joined as a driver
    const userJoinedAsDriver = await Driver.findOne({ userId: req.user.id });
    if (userJoinedAsDriver) {
      throw new ErrorResponse(req.t("driver_joined_already"), 400);
    }

    // Create the new driver
    const newDriver = await Driver.create({
      userId: req.user.id,
      ...req.body,
    });

    // If everything is successful, return response
    res.status(201).json({
      success: true,
      data: newDriver,
      message: req.t("driver_created"),
    });
    logger.info("done createDriverCtrl");
  } catch (error) {
    // Handle error cases, delete uploaded photo only if an error occurs
    if (uploadedPhoto) {
      try {
        await cloudinary.uploader.destroy(uploadedPhoto);
      } catch (deleteError) {
        logger.error(`Failed to delete the image: ${deleteError}`);
      }
    }

    // Handle duplicate phone number error
    if (error.code === 11000) {
      return next(new ErrorResponse(req.t("phone_duplication"), 400));
    }

    // Pass the error to the next middleware
    next(error);
  }
});

/**
 * @desc get all drivers
 * @route /api/v1/drivers
 * @method GET
 * @access public
 */
module.exports.getDriversCtrl = asyncHandler(async (req, res, next) => {
  logger.info("started getDriversCtrl");

  try {
    let { page, experienceYears, province, cities } = req.query;
    page = parseInt(page) || 1;
    const PAGE_SIZE = 20;

    const query = {
      isAccepted: true,
    };
    if (province && province !== "all") {
      query["province"] = province;
    }
    if (cities) {
      cities = cities.split(",");
      if (!cities.includes("all")) {
        query["city"] = { $in: cities };
      }
    }
    if (experienceYears) {
      experienceYears = experienceYears.split(",");
      if (!experienceYears.includes("all")) {
        query["$or"] = experienceYears.map((range) => {
          const [min, max] = range.split("-").map(Number);
          return { experienceYears: { $gte: min, $lte: max || Infinity } };
        });
      }
    }

    const drivers = await Driver.find(query)
      .skip(PAGE_SIZE * (page - 1))
      .limit(PAGE_SIZE)
      .sort({ createdAt: -1 })
      .populate("province city");

    const count = await Driver.countDocuments(query);
    res.status(200).json({ drivers, count });
    logger.info("done getDriversCtrl");
  } catch (error) {
    next(error);
  }
});

/**
 * @desc get single driver
 * @route /api/v1/drivers/:id
 * @method GET
 * @access public
 */
module.exports.getSingleDriverCtrl = asyncHandler(async (req, res, next) => {
  logger.info("started getSingleDriverCtrl");

  try {
    const { id } = req.params;
    const token = req.headers?.authorization?.split(" ")[1];

    let user = null;

    if (token) {
      try {
        user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      } catch (error) {
        return next(new ErrorResponse("دخول غير مسموح1", 401));
      }
    }

    let driver;

    if (user) {
      driver = await Driver.findOne({
        _id: id,
        $or: [{ userId: user.id }, { isAccepted: true }],
      }).populate("province city");
    } else {
      driver = await Driver.findOne({
        _id: id,
        isAccepted: true,
      }).populate("province city");
    }

    if (!driver) {
      return next(new ErrorResponse(req.t("driver_not_found"), 404));
    }

    res.status(200).json({
      success: true,
      data: driver,
      message: "Success",
    });
    logger.info("done getSingleDriverCtrl");
  } catch (error) {
    next(error);
  }
});

/**
 * @desc update driver
 * @route /api/v1/drivers/:id
 * @method PUT
 * @access private (only user himself)
 */
module.exports.updateDriverCtrl = asyncHandler(async (req, res, next) => {
  logger.info("started updateDriverCtrl");

  try {
    const { error } = validateUpdateDriver(req.body);
    if (error) {
      return next(new ErrorResponse(error.details[0].message, 400));
    }
    const driver = await Driver.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!driver) {
      return next(new ErrorResponse(req.t("driver_not_found"), 404));
    }

    // Delete the old photo from Cloudinary if a new photo is provided
    if (req.body.photo && driver.photo?.public_id) {
      await cloudinary.uploader.destroy(driver.photo.public_id);
    }

    const updatedDriver = await Driver.findByIdAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      { ...req.body, isAccepted: false },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      data: updatedDriver._id,
      message: req.t("data_updated"),
    });
    logger.info("done updateDriverCtrl");
  } catch (error) {
    next(error);
  }
});

/**
 * @desc delete driver
 * @route /api/v1/drivers/:id
 * @method DELETE
 * @access private (only admin and user himself)
 */
module.exports.deleteDriverCtrl = asyncHandler(async (req, res, next) => {
  logger.info("started deleteDriverCtrl");

  const { id } = req.params;

  try {
    const driver = await Driver.findOne({ _id: id });
    if (!driver) {
      return next(new ErrorResponse(req.t("driver_not_found"), 404));
    }

    if (driver.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new ErrorResponse(req.t("forbidden"), 301));
    }

    // Delete the driver's photo from Cloudinary
    if (driver.photo?.public_id) {
      await cloudinary.uploader.destroy(driver.photo.public_id);
    }

    // Delete driver
    const deletedDriver = await Driver.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      data: deletedDriver,
      message: req.t("driver_deleted"),
    });
    logger.info("done deleteDriverCtrl");
  } catch (error) {
    next(error);
  }
});
