const asyncHandler = require("express-async-handler");
const {
  User,
  validateRegisterUser,
  validateLoginUser,
} = require("../models/User");
const bcrypt = require("bcrypt");

/**
 * @desc register user
 * @route /api/auth/register
 * @method POST
 * @access public
 */
module.exports.registerUserCtrl = asyncHandler(async (req, res) => {
  const { error } = validateRegisterUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(500).json({ message: req.t("account_exist") });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
    mobile: req.body.mobile,
  });
  await user.save();

  res.status(201).json(req.t("account_created"));
});

/**
 * @desc login user
 * @route /api/auth/login
 * @method POST
 * @access public
 */
module.exports.loginUserCtrl = asyncHandler(async (req, res) => {
  const { error } = validateLoginUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({
      message: req.t("incorrect_login_data"),
    });
  }
  const isPasswordMatch = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isPasswordMatch) {
    return res.status(400).json({ message: req.t("incorrect_login_data") });
  }
  const token = user.generateAuthToken();

  res.status(200).json({
    id: user._id,
    token,
    email: user.email,
    isAdmin: user.isAdmin,
    username: user.username,
    profilePhoto: user.profilePhoto,
  });
});
