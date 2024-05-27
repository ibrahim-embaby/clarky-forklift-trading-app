const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const connectToDb = require("./config/connectToDb");
const cookieParser = require("cookie-parser");

const app = express();
require("dotenv").config();

const i18next = require("i18next");
const i18nextMiddleware = require("i18next-http-middleware");
const { configI18n } = require("./config/i18n");
const { errorHandler, notFound } = require("./middlewares/error");

// const production = require("./utils/constants");

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
    origin: ["http://localhost:3000"],
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
app.use("/api/v1/controls", require("./routes/controlsRoutes"));
app.use("/api/v1/upload", require("./routes/uploadRoute"));

app.use(notFound);
app.use(errorHandler);

PORT = process.env.PORT || 8000;
const server = app.listen(PORT, console.log(`server is running on ${PORT}`));

// ============= socket.io ==============

// const io = require("socket.io")(server, {
//   cors: {
//     origin: production
//       ? "https://arabity-fzmr.onrender.com"
//       : "http://localhost:3000",
//   },
// });

// let users = [];

// const addUser = (userId, socketId) => {
//   !users.some((user) => user.userId === userId) &&
//     users.push({ userId, socketId });
// };

// const removeUser = (socketId) => {
//   users = users.filter((user) => user.socketId !== socketId);
// };

// const getUser = (userId) => {
//   return users.find((user) => user.userId === userId);
// };

// io.on("connection", (socket) => {
//   console.log("🚀 Someone connected!", socket.id);
//   // console.log(users);

//   // get userId and socketId from client
//   socket.on("addUser", (userId) => {
//     addUser(userId, socket.id);
//     io.emit("getUsers", users);
//   });

//   // get and send message
//   socket.on("sendMessage", ({ senderId, receiverId, content }) => {
//     const user = getUser(receiverId);

//     io.to(user?.socketId).emit("getMessage", {
//       senderId,
//       content,
//     });
//   });

//   // user disconnected
//   socket.on("disconnect", () => {
//     console.log("⚠️ Someone disconnected");
//     removeUser(socket.id);
//     io.emit("getUsers", users);
//     // console.log(users);
//   });
// });

// io.on("error", (err) => {
//   // Do something when an error occurs.
//   if (err.code === "net::ERR_CONNECTION_REFUSED") {
//     // The network is down. Close the connection.
//     socket.disconnect();
//   }
// });
