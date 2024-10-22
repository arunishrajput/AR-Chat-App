// Node server which will handle socket io connections

require("dotenv").config(); // Load environment variables

const port = process.env.PORT || 8000;

const allowedOrigins = [process.env.CLIENT_1_URL, process.env.CLIENT_2_URL]; // Fetch allowed client origins from the environment variable.

const io = require("socket.io")(port, {
    cors: {
        origin: function (origin, callback) {
            if (allowedOrigins.includes(origin) || !origin) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["GET", "POST"],
    },
});

console.log("Backend running on:", process.env.PORT);

const users = {};

io.on("connection", (socket) => {
    // If any new user joins, let other users connected to the server know!
    socket.on("new-user-joined", (username) => {
        // console.log("new user joined", username);
        users[socket.id] = username;
        socket.broadcast.emit("user-joined", username);
        // Send the updated list of users to all connected users
        io.emit("update-user-list", Object.values(users)); // Update all users with the new list
    });

    // If someone sends a message, broadcast it to other people!
    socket.on("send", (message) => {
        socket.broadcast.emit("receive", {
            message: message,
            username: users[socket.id],
        });
    });

    // If someone leaves the chat, let others know!
    socket.on("disconnect", (message) => {
        socket.broadcast.emit("left", users[socket.id]);
        delete users[socket.id];
        // Send the updated list of users to all connected users
        io.emit("update-user-list", Object.values(users));
    });
});
