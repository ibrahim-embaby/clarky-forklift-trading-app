const mongoose = require("mongoose");
const Joi = require("joi");

const AdSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    itemType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ItemType",
      required: true,
    },
    title: {
      type: String,
      min: 3,
      required: true,
    },
    description: {
      type: String,
      min: 3,
      required: true,
    },
    photos: {
      type: Array,
      required: true,
    },
    tags: {
      type: Array,
    },
    quantity: {
      type: String,
      required: true,
      min: 1,
    },
    price: {
      type: String,
      min: 1,
      required: true,
    },
    province: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Province",
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
    },
    phone: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    refrenceFile: {
      type: String,
    },
    views: {
      type: Number,
      default: 0,
    },
    saleOrRent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdTarget",
      required: true,
    },
    status: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Status",
      required: true,
    },
    adStatus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdStatus",
      default: "66561ffef02664c8780482f7",
    },
  },
  { timestamps: true }
);

function validateCreateAd(object) {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    province: Joi.string().required(),
    city: Joi.string().required(),
    photos: Joi.array().items(Joi.string()),
    tags: Joi.array().items(Joi.string()),
    price: Joi.string().required(),
    location: Joi.string(),
    quantity: Joi.string().required(),
    refrenceFile: Joi.string(),
    phone: Joi.string().required(),
    status: Joi.string().required(),
    itemType: Joi.string().required(),
    saleOrRent: Joi.string().required(),
  });

  return schema.validate(object);
}
AdSchema.index({ title: "text", description: "text" });

function validateUpdateAd(object) {
  const schema = Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    address: Joi.string(),
    photos: Joi.array().items(
      Joi.object({
        publicId: Joi.string(),
        url: Joi.string(),
      })
    ),
    tags: Joi.array().items(Joi.string()),
    price: Joi.string(),
    location: Joi.string(),
    refrenceFile: Joi.string(),
    status: Joi.string().valid("private", "pending", "published", "blocked"),
  });

  return schema.validate(object);
}

const Ad = mongoose.model("Ad", AdSchema);

module.exports = {
  Ad,
  validateCreateAd,
  validateUpdateAd,
};
