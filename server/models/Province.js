const mongoose = require("mongoose");
const Joi = require("joi");

const ProvinceSchema = new mongoose.Schema(
  {
    label: {
      ar: {
        type: String,
        required: true,
        trim: true,
      },
      en: {
        type: String,
        required: true,
        trim: true,
      },
    },
    value: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ProvinceSchema.virtual("cities", {
  ref: "City",
  foreignField: "province",
  localField: "_id",
});

function validateCreateProvince(object) {
  const schema = Joi.object({
    value: Joi.string().trim().required(),
    label: Joi.object({
      ar: Joi.string().required(),
      en: Joi.string().required(),
    }).required(),
  });

  return schema.validate(object, {
    errors: {
      messages: {
        required: "This field is required",
        unique: "This value must be unique",
      },
    },
  });
}

const Province = mongoose.model("Province", ProvinceSchema);

module.exports = {
  Province,
  validateCreateProvince,
};
