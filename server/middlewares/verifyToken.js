const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { User } = require("../models/User");
const ErrorResponse = require("../utils/ErrorResponse");

dotenv.config();
// verify token
async function verifyToken(req, res, next) {
  const authToken = req.headers.authorization;
  if (authToken) {
    const token = authToken.split(" ")[1];
    try {
      const decodedPayload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decodedPayload.id);
      if (!user) {
        return next(new ErrorResponse("هذا المستخدم غير موجود", 404));
      }
      req.user = decodedPayload;
      next();
    } catch (err) {
      return res.status(401).json({ message: "دخول غير مسموح1" });
    }
  } else {
    return res.status(403).json({ message: "2دخول غير مسموح" });
  }
}

// verify token and only user himself
async function verifyTokenAndOnlyUser(req, res, next) {
  await verifyToken(req, res, () => {
    if (req.user.id === req.params.id) {
      next();
    } else {
      return res.status(403).json({ message: "غير مسموح" });
    }
  });
}

async function verifyTokenAndAdmin(req, res, next) {
  await verifyToken(req, res, () => {
    if (req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({ message: "دخول غير مسموح" });
    }
  });
}

async function verifyTokenAndAuthorization(req, res, next) {
  await verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({ message: "دخول غير مسموح" });
    }
  });
}

module.exports = {
  verifyToken,
  verifyTokenAndOnlyUser,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
};
