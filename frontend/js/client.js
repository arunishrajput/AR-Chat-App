const socket = io("https://ar-chat-app-h1pj.onrender.com/"); // SOCKET SERVER URL

// Get DOM elements in respective Js variables
const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");
const userListContainer = document.querySelector(".user-list"); // New container for user list

// Audio that will play on different events
var joinaudio = new Audio("assets/audio/joinsound.mp3");
var sentaudio = new Audio("assets/audio/sentsound.mp3");
var receiveaudio = new Audio("assets/audio/receivesound.mp3");
var leftaudio = new Audio("assets/audio/leftsound.mp3");

let username; // Initialize the username variable

// Function to ask for username
const askForUsername = () => {
    username = prompt("Enter a username to join: ");
    if (!username || username.trim() === "") {
        // If the username is invalid, show a message and return
        alert("Username cannot be empty. Please enter a valid username.");
        askForUsername(); // Recursively ask for username again
    } else {
        socket.emit("new-user-joined", username); // Emit the username to the server
    }
};

// Call the function initially
askForUsername();

// Function to get the current timestamp
const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// Function to append messages event info to the container
const append = (message, username, position, messageType = "normal") => {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", position);

    // Apply different styling for join/left messages
    if (messageType === "event") {
        messageElement.classList.add("event-message");
    }

    // Create a span for the username and message
    const usernameElement = document.createElement("strong");
    usernameElement.innerText = username;

    const messageText = document.createElement("span");
    messageText.innerText = `: ${message}`;

    // Create a span for the timestamp in subscript
    const timestampElement = document.createElement("span");
    timestampElement.innerHTML = ` <sub class="timestamp">[${getCurrentTime()}]</sub>`; // Add the timestamp with a class

    // Append username, message, and timestamp to the message element
    messageElement.append(usernameElement, messageText, timestampElement);
    messageContainer.append(messageElement);

    // Scroll to the bottom whenever a new message is added
    messageContainer.scrollTop = messageContainer.scrollHeight;
};

// Function to update user list
const updateUserList = (users) => {
    userListContainer.innerHTML = ""; // Clear existing users
    users.forEach((user) => {
        const userElement = document.createElement("span");
        userElement.classList.add("user");
        userElement.innerText = user;
        userListContainer.appendChild(userElement);
    });
};

// If a new user joins, receive his/her username from the server
socket.on("user-joined", (user) => {
    append("joined the chat", user, "right", "event");
    joinaudio.play();
});

// If server sends a message, receive it!
socket.on("receive", (data) => {
    append(data.message, data.username, "left");
    receiveaudio.play();
});

// If a user leaves the chat, append the info to the container
socket.on("left", (user) => {
    append("left the chat", user, "right", "event");
    leftaudio.play();
});

// Listen for user list updates
socket.on("update-user-list", (users) => {
    updateUserList(users);
});

// If the form gets submitted, send server the message!
form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!username) {
        // If no username, ask for it again
        alert("You need to enter a username first!");
        askForUsername();
        return; // Stop the function if no username
    }
    const message = messageInput.value;
    append(message, "You", "right");
    socket.emit("send", message);
    messageInput.value = "";
    sentaudio.play();
    // Re-focus the message input field
    messageInput.focus();
});
