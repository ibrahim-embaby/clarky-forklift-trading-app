const asyncHandler = require("express-async-handler");
const { Province, validateCreateProvince } = require("../models/Province");
const { City, validateCreateCity } = require("../models/City");
const { Status, validateStatus } = require("../models/Status");
const { validateItemType, ItemType } = require("../models/ItemType");
const { validateAdTarget, AdTarget } = require("../models/AdTarget");
const { validateAdStatus, AdStatus } = require("../models/AdStatus");
const ErrorResponse = require("../utils/ErrorResponse");

/* ============= PROVINCE CONTROLLERS ============= */
/**
 * @desc create province
 * @route /api/v1/controls/provinces
 * @method POST
 * @access private (admin only)
 */
module.exports.addProvinceCtrl = asyncHandler(async (req, res, next) => {
  try {
    const { error } = validateCreateProvince(req.body);
    if (error) {
      return next(new ErrorResponse(error.details[0].message, 400));
    }

    const newProvince = await Province.create(req.body);

    res.status(201).json({ data: newProvince, message: "تمت الإضافة" });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc get provinces
 * @route /api/v1/controls/provinces
 * @method GET
 * @access public
 */
module.exports.getProvincesCtrl = asyncHandler(async (req, res, next) => {
  try {
    const provinces = await Province.find({ isActive: true })
      .select("_id label value")
      .populate({
        path: "cities",
        select: "label value _id -province",
      });
    res.status(200).json(provinces);
  } catch (error) {
    next(error);
  }
});

/**
 * @desc get single province
 * @route /api/v1/controls/provinces/:id
 * @method GET
 * @access public
 */
module.exports.getSingleProvinceCtrl = asyncHandler(async (req, res, next) => {
  try {
    const province = await Province.findById(req.params.id).populate("cities");
    res.status(200).json(province);
  } catch (error) {
    next(error);
  }
});

/**
 * @desc create city
 * @route /api/v1/controls/cities
 * @method POST
 * @access private (admin only)
 */
module.exports.addCityCtrl = asyncHandler(async (req, res, next) => {
  try {
    const { error } = validateCreateCity(req.body);
    if (error) {
      return next(new ErrorResponse(error.details[0].message, 400));
    }

    const newCity = await City.create(req.body);

    res.status(201).json({ data: newCity, message: "تمت الإضافة" });
  } catch (error) {
    next(error);
  }
});

/* ============= STATUS CONTROLLERS ============= */
/**
 * @desc add new car
 * @route /api/v1/controls/statuses
 * @method POST
 * @access private (only admin)
 */
module.exports.addStatusCtrl = asyncHandler(async (req, res, next) => {
  try {
    const { error } = validateStatus(req.body);
    if (error) {
      return next(new ErrorResponse(error.details[0].message, 400));
    }

    const newStatus = await Status.create(req.body);
    res.status(201).json({ data: newStatus, message: "تمت الإضافة" });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc get statuses
 * @route /api/v1/controls/statuses
 * @method GET
 * @access public
 */
module.exports.getStatusCtrl = asyncHandler(async (req, res, next) => {
  try {
    const statuses = await Status.find({ isActive: true }).select(
      "_id label value"
    );

    res.status(200).json(statuses);
  } catch (error) {
    next(error);
  }
});

/* ============= ITEM TYPE CONTROLLERS ============= */
/**
 * @desc add new item type
 * @route /api/v1/controls/item-types
 * @method POST
 * @access private (only admin)
 */
module.exports.addItemTypeCtrl = asyncHandler(async (req, res, next) => {
  try {
    const { error } = validateItemType(req.body);
    if (error) {
      return next(new ErrorResponse(error.details[0].message, 400));
    }
    const newItemType = await ItemType.create(req.body);
    res.status(201).json({ data: newItemType, message: "تمت الإضافة" });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc get itemTypes
 * @route /api/v1/controls/itemTypes
 * @method GET
 * @access public
 */
module.exports.getItemTypeCtrl = asyncHandler(async (req, res, next) => {
  try {
    const itemTypes = await ItemType.find({ isActive: true }).select(
      "_id label value"
    );
    res.status(200).json(itemTypes);
  } catch (error) {
    next(error);
  }
});

/* ============= AD TARGET CONTROLLERS ============= */
/**
 * @desc add new ad target
 * @route /api/v1/controls/ad-targets
 * @method POST
 * @access private (only admin)
 */
module.exports.addAdTargetCtrl = asyncHandler(async (req, res, next) => {
  try {
    const { error } = validateAdTarget(req.body);
    if (error) {
      return next(new ErrorResponse(error.details[0].message, 400));
    }
    const newAdTarget = await AdTarget.create(req.body);
    res.status(201).json({ data: newAdTarget, message: "تمت الإضافة" });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc get ad targets
 * @route /api/v1/controls/ad-targets
 * @method GET
 * @access public
 */
module.exports.getAdTargetCtrl = asyncHandler(async (req, res, next) => {
  try {
    const adTargets = await AdTarget.find({ isActive: true }).select(
      "_id label value"
    );

    res.status(200).json(adTargets);
  } catch (error) {
    next(error);
  }
});

/* ============= AD STATUS CONTROLLERS ============= */
/**
 * @desc add new ad status
 * @route /api/v1/controls/ad-statuses
 * @method POST
 * @access private (only admin)
 */
module.exports.addAdStatusCtrl = asyncHandler(async (req, res, next) => {
  try {
    const { error } = validateAdStatus(req.body);
    if (error) {
      return next(new ErrorResponse(error.details[0].message, 400));
    }
    const newAdStatus = await AdStatus.create(req.body);
    res.status(201).json({ data: newAdStatus, message: "تمت الإضافة" });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc get ad targets
 * @route /api/v1/controls/ad-targets
 * @method GET
 * @access public
 */
module.exports.getAdStatusCtrl = asyncHandler(async (req, res, next) => {
  try {
    const adStatuses = await AdStatus.find({ isActive: true }).select(
      "_id label value backgroundColor"
    );

    res.status(200).json(adStatuses);
  } catch (error) {
    next(error);
  }
});

/* PROTOTYPE */
/**
 * @desc
 * @route
 * @method
 * @access
 */

// module.exports.addProvinceCtrl = asyncHandler( async(req, res,next) => {
//     try {

//     } catch (error) {
//         next(error)
//     }
// })
