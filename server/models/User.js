const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

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
    bio: {
      type: String,
      default: "",
    },
    mobile: {
      type: String,
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
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// hash password before save
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

// Generate Auth Tokens
UserSchema.methods.getSignedToken = function () {
  const accessToken = jwt.sign(
    { id: this._id, role: this.role },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "60d",
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

UserSchema.methods.getToken = function (secret) {
  const randomstring = crypto.randomBytes(20).toString("hex");
  const token = jwt.sign(
    {
      randomstring,
      id: this._id,
    },
    secret,
    {
      expiresIn: "30m",
    }
  );

  return token;
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

function validateUpdateUser(obj) {
  const schema = Joi.object({
    username: Joi.string().trim().min(1).max(100),
    mobile: Joi.string().trim().min(11).max(14),
    bio: Joi.string().trim().max(1000),
    profilePhoto: Joi.object({
      public_id: Joi.string(),
      url: Joi.string(),
    }),
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

module.exports = {
  User,
  validateCreateUser,
  validateLoginUser,
  validateUpdateUser,
};
