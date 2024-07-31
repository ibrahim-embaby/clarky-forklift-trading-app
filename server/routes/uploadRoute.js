const express = require("express");
const { v1: uuid } = require("uuid");
const { verifyToken } = require("../middlewares/verifyToken");
const cloudinary = require("cloudinary").v2;

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post("/", verifyToken, async (req, res) => {
  const { count } = req.body;

  if (!count || count <= 0) {
    return res.status(400).json({ message: "Invalid count value" });
  }

  try {
    const uploadConfigs = await Promise.all(
      Array.from({ length: count }).map(() => {
        const public_id = `${req.user.id}/${uuid()}`;
        const timestamp = Math.round(new Date().getTime() / 1000);

        const signature = cloudinary.utils.api_sign_request(
          {
            timestamp,
            public_id,
          },
          process.env.CLOUDINARY_API_SECRET
        );

        return {
          public_id,
          url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
          signature,
          api_key: process.env.CLOUDINARY_API_KEY,
          timestamp,
        };
      })
    );

    res.status(200).json(uploadConfigs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
