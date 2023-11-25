const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 1,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profilePhoto: {
      type: Object,
      default: {
        url: "https://res.cloudinary.com/dotcfrg0k/image/upload/v1698526360/df9ucku2gdjixyavkoul.png",
        publicId: "df9ucku2gdjixyavkoul",
      },
    },
  },
  { timestamps: true }
);

// Generate Auth Tokens
UserSchema.methods.getSignedToken = function () {
  const accessToken = jwt.sign(
    { id: this._id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1min",
    }
  );
  const refreshToken = jwt.sign(
    { id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "60d",
    }
  );
  return { accessToken, refreshToken };
};

const User = mongoose.model("User", UserSchema);

// validate registered user
function validateCreateUser(obj) {
  const schema = Joi.object({
    username: Joi.string().trim().min(1).required(),
    email: Joi.string().trim().required().email(),
    password: Joi.string().trim().min(5).required(),
    mobile: Joi.string().trim().min(11).max(14).required(),
  });
  return schema.validate(obj);
}

// validate login user
function validateLoginUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().required().email(),
    password: Joi.string().trim().min(5).required(),
  });
  return schema.validate(obj);
}

module.exports = { User, validateCreateUser, validateLoginUser };
