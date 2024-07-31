const mongoose = require("mongoose");
const Joi = require("joi");

const DriverSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
      minlength: 1,
      trim: true,
    },
    experienceYears: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: "",
    },
    mobile: {
      type: String,
      unique: true,
      trim: true,
    },
    province: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Province",
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
    },
    age: {
      type: Number,
      required: true,
    },
    photo: {
      type: Object,
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
    rejectionReason: {
      type: String,
    },
  },
  { timestamps: true }
);

const Driver = mongoose.model("Driver", DriverSchema);

function validateCreateDriver(object) {
  const schema = Joi.object({
    name: Joi.string().required(),
    experienceYears: Joi.number().required(),
    description: Joi.string(),
    mobile: Joi.string().trim().min(11).max(14).required(),
    province: Joi.string().required(),
    city: Joi.string().required(),
    age: Joi.number().min(18).max(90).required(),
    photo: Joi.object({
      public_id: Joi.string(),
      url: Joi.string(),
    }).required(),
  });

  return schema.validate(object);
}

function validateUpdateDriver(object) {
  const schema = Joi.object({
    name: Joi.string(),
    experienceYears: Joi.number(),
    description: Joi.string(),
    mobile: Joi.string().trim().min(11).max(14),
    province: Joi.string(),
    city: Joi.string(),
    age: Joi.number().min(18).max(90),
    photo: Joi.object({
      public_id: Joi.string(),
      url: Joi.string(),
    }),
  });

  return schema.validate(object);
}

module.exports = {
  Driver,
  validateCreateDriver,
  validateUpdateDriver,
};
