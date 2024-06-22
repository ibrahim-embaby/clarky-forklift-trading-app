const socketio = require("socket.io");

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
    },
  });

  io.on("connection", (socket) => {
    console.log("🚀 Someone connected!", socket.id);

    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      console.log("User added:", users);
    });

    socket.on("sendNotificationAlert", ({ receiverId }) => {
      const user = getUser(receiverId);
      if (user) {
        io.to(user.socketId).emit("getNotificationAlert");
      }
    });

    socket.on("disconnect", () => {
      console.log("⚠️ Someone disconnected");
      removeUser(socket.id);
    });
  });

  io.on("error", (err) => {
    console.error("Socket error:", err);
  });

  return io;
};

module.exports = setupSocket;
