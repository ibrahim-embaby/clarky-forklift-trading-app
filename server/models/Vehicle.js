const mongoose = require("mongoose");
const Joi = require("joi");

const CarSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    make: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    forkLength: {
      type: Number,
    },
    capacity: {
      type: String,
      required: true,
      trim: true,
    },
    fuelType: {
      type: String,
      required: true,
      trim: true,
    },
    yearManufactured: { type: String, required: true, trim: true },
    mastType: { type: String, required: true, trim: true },
    tireType: { type: String, required: true, trim: true },
    features: { type: Array },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

function validateCar(object) {
  const schema = Joi.object({
    name: Joi.string().required().trim().unique(),
    code: Joi.string().required(),
    isActive: Joi.boolean(),
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

const Car = mongoose.model("Car", CarSchema);

module.exports = {
  Car,
  validateCar,
};
