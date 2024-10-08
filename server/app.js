const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const connectToDb = require("./config/connectToDb");
const cookieParser = require("cookie-parser");
const logger = require("./config/logger");

const app = express();
require("dotenv").config();

const i18next = require("i18next");
const i18nextMiddleware = require("i18next-http-middleware");
const { configI18n } = require("./config/i18n");
const { errorHandler, notFound } = require("./middlewares/error");
const allowedOrigins = require("./utils/allowedOrigins");
const setupSocket = require("./config/socket");

// connection to DB
connectToDb();

// i18n configuration
configI18n();
app.use(cookieParser());

// middlewares
app.use(express.json());

// Security Headers (helmet)
app.use(helmet());

// Cors
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// i18n
app.use(i18nextMiddleware.handle(i18next));

// Routes
app.use("/api/v1/admin", require("./routes/adminRoutes"));
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/ads", require("./routes/adRoutes"));
app.use("/api/v1/drivers", require("./routes/driverRoutes"));
app.use("/api/v1/controls", require("./routes/controlsRoutes"));
app.use("/api/v1/notifications", require("./routes/notificationRoutes"));
app.use("/api/v1/upload", require("./routes/uploadRoute"));

app.use(notFound);
app.use(errorHandler);

PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  logger.info(`Server is running on ${PORT}`);
});

setupSocket(server, allowedOrigins);
