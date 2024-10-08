const mongoose = require("mongoose");
const logger = require("./logger");

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("connected to db");
  } catch (err) {
    logger.error("ERROR ON CONNECTION TO DB");
  }
};
