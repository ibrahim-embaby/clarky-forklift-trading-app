const asyncHandler = require("express-async-handler");
const { validateCreateClark, Clark } = require("../models/Clark");
const ErrorResponse = require("../utils/ErrorResponse");

/**
 * @desc create clark
 * @route /api/clarks/
 * @method POST
 * @access private (logged user only)
 */
module.exports.createClarkCtrl = asyncHandler(async (req, res, next) => {
  try {
    const { error } = validateCreateClark(req.body);
    if (error) return next(new ErrorResponse(error.details[0].message, 400));

    const newClark = await Clark.create(req.body);

    res.status(201).json({
      success: true,
      data: newClark,
      message: req.t("clark_created"),
    });
  } catch (error) {
    next(req.t("server_error"));
  }
});

/**
 * @desc get clarks
 * @route /api/clarks/
 * @method GET
 * @access public
 */
module.exports.getAllPublicClarksCtrl = asyncHandler(async (req, res, next) => {
  try {
    const clarks = await Clark.find({ privacy: "public" })
      .populate("doc", "username profilePhoto _id")
      .populate({
        path: "comments",
        populate: {
          path: "doc",
          select: "username _id profilePhoto",
        },
        // sort not work
        sort: { createdAt: -1 },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(clarks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: req.t("server_error") });
  }
});

/**
 * @desc get all user clarks
 * @route /api/clarks/user/:userId
 * @method GET
 * @access public
 */
module.exports.getAllUserClarksCtrl = asyncHandler(async (req, res, next) => {
  try {
    const { userId } = req.params;
    const clarks = await Clark.find({ doc: userId })
      .populate("doc", "username profilePhoto _id")
      .populate({
        path: "comments",
        populate: {
          path: "doc",
          select: "username _id profilePhoto",
        },
        // sort not work
        sort: { createdAt: -1 },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(clarks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: req.t("server_error") });
  }
});

/**
 * @desc get single clark
 * @route /api/clarks/:clarkId
 * @method GET
 * @access public
 */
module.exports.getSingleClarkCtrl = asyncHandler(async (req, res, next) => {
  try {
    const { clarkId } = req.params;
    const clark = await Clark.findById(clarkId)
      .populate("doc", "username profilePhoto _id")
      .populate({
        path: "comments",
        populate: {
          path: "doc",
          select: "username _id profilePhoto",
        },
        // sort not work
        sort: { createdAt: -1 },
      });
    if (!clark)
      return res.status(404).json({ message: req.t("clark_not_found") });
    res.status(200).json(clark);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: req.t("server_error") });
  }
});

/**
 * @desc update clark
 * @route /api/clarks/:clarkId
 * @method PUT
 * @access private (only user himself)
 */
module.exports.updateSingleClarkCtrl = asyncHandler(async (req, res, next) => {
  try {
    const { clarkId } = req.params;
    const { text, privacy } = req.body;

    const clark = await Clark.findById(clarkId);
    if (!clark)
      return res.status(404).json({ message: req.t("clark_not_found") });
    const userId = clark.doc;
    if (userId.toString() !== req.user.id) {
      return res.status(301).json({ message: req.t("forbidden") });
    }
    const updatedClark = await Clark.findByIdAndUpdate(
      clarkId,
      { text, privacy },
      { new: true }
    )
      .populate("doc", "username _id profilePhoto")
      .populate({
        path: "comments",
        populate: {
          path: "doc",
          select: "username _id profilePhoto",
        },
      });
    res.status(200).json({ data: updatedClark, message: req.t("clark_edit") });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: req.t("server_error") });
  }
});

/**
 * @desc delete clark
 * @route /api/clarks/:clarkId
 * @method DELETE
 * @access private (only user himself)
 */
module.exports.deleteSingleClarkCtrl = asyncHandler(async (req, res, next) => {
  try {
    const { clarkId } = req.params;
    const clark = await Clark.findById(clarkId);
    if (!clark)
      return res.status(404).json({ message: req.t("clark_not_found") });
    const userId = clark.doc;
    if (userId.toString() !== req.user.id) {
      return res.status(301).json({ message: req.t("forbidden") });
    }
    const deletedClark = await Clark.findByIdAndDelete(clarkId);
    res
      .status(200)
      .json({ data: deletedClark, message: req.t("clark_deleted") });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: req.t("server_error") });
  }
});

/**
 * @desc like clark
 * @route /api/clarks/:clarkId/like
 * @method PUT
 * @access private (logged user)
 */
module.exports.likeClarkCtrl = asyncHandler(async (req, res, next) => {
  try {
    const { clarkId } = req.params;
    const clark = await Clark.findById(clarkId);
    if (!clark)
      return res.status(404).json({ message: req.t("clark_not_found") });
    const likedClark = await Clark.findOneAndUpdate(
      { _id: clarkId, likedBy: { $nin: req.user.id } },
      { $push: { likedBy: req.user.id }, $inc: { likes: 1 } },
      { new: true }
    );
    if (!likedClark)
      return res.status(403).json({ message: req.t("liked_alreclarky") });
    res.status(200).json({ data: likedClark, message: req.t("success") });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: req.t("server_error") });
  }
});

/**
 * @desc dislike clark
 * @route /api/clarks/:clarkId/unlike
 * @method PUT
 * @access private (logged user)
 */
module.exports.unlikeClarkCtrl = asyncHandler(async (req, res, next) => {
  try {
    const { clarkId } = req.params;
    const clark = await Clark.findById(clarkId);
    if (!clark)
      return res.status(404).json({ message: req.t("clark_not_found") });
    const unlikedClark = await Clark.findOneAndUpdate(
      { _id: clarkId, likedBy: { $in: req.user.id } },
      { $pull: { likedBy: req.user.id }, $inc: { likes: -1 } },
      { new: true }
    );
    if (!unlikedClark)
      return res.status(403).json({ message: req.t("unliked_yet") });
    res.status(200).json({ data: unlikedClark, message: req.t("success") });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: req.t("server_error") });
  }
});
