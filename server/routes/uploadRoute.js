const router = require("express").Router();
const { v1: uuid } = require("uuid");
const { verifyToken } = require("../middlewares/verifyToken");

const S3 = require("aws-sdk/clients/s3");
const s3 = new S3({
  region: process.env.AWS_S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_IAM_ACCESS_KEY,
    secretAccessKey: process.env.AWS_IAM_SECRET_ACCESS_KEY,
  },
});

router.post("/", verifyToken, async (req, res) => {
  const { count } = req.body;

  if (!count || count <= 0) {
    return res.status(400).json({ message: "Invalid count value" });
  }

  try {
    const urls = await Promise.all(
      Array.from({ length: count }).map(() => {
        const key = `${req.user.id}/${uuid()}.jpeg`;
        return s3
          .getSignedUrlPromise("putObject", {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            ContentType: "image/jpeg",
            Key: key,
          })
          .then((url) => ({ key, url }));
      })
    );

    res.status(200).json(urls);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
