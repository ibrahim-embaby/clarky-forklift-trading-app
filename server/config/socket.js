const socketio = require("socket.io");
const logger = require("./logger");

let users = [];

const addUser = (userId, socketId) => {
  if (!users.some((user) => user.userId === userId)) {
    users.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => users.find((user) => user.userId === userId);

const setupSocket = (server, allowedOrigins) => {
  const io = socketio(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    logger.info(`🚀 Someone connected! ${socket.id}`);

    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      logger.info(`User added: ${users}`);
    });

    socket.on("sendNotificationAlert", ({ receiverId }) => {
      const user = getUser(receiverId);
      if (user) {
        io.to(user.socketId).emit("getNotificationAlert");
      }
    });

    socket.on("disconnect", () => {
      logger.info("⚠️ Someone disconnected");
      removeUser(socket.id);
    });
  });

  io.on("error", (err) => {
    logger.error(`Socket error: ${err}`);
  });

  return io;
};

module.exports = setupSocket;
