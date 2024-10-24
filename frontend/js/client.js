const socket = io("https://ar-chat-app-h1pj.onrender.com/"); // SOCKET SERVER URL

// Get DOM elements in respective Js variables
const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(
    ".container .message-container"
); // Updated selector
const userListContainer = document.querySelector(".user-list"); // New container for user list
const typingIndicator = document.querySelector(".typing-indicator"); // Typing indicator element
let isAtBottom = true; // Default to true, assuming the user starts at the bottom

// Audio that will play on different events
var joinaudio = new Audio("assets/audio/joinsound.mp3");
var sentaudio = new Audio("assets/audio/sentsound.mp3");
var receiveaudio = new Audio("assets/audio/receivesound.mp3");
var leftaudio = new Audio("assets/audio/leftsound.mp3");

let username; // Initialize the username variable
let typingTimeout; // Variable to store typing timeout

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
    timestampElement.innerHTML = ` <sub class="timestamp">${getCurrentTime()}</sub>`; // Add the timestamp with a class

    // Append username, message, and timestamp to the message element
    messageElement.append(usernameElement, messageText, timestampElement);
    messageContainer.append(messageElement);
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

// Show typing indicator
const showTyping = (user) => {
    hideTyping(); // Hide any existing typing indicators

    // Create typing indicator element
    const typingElement = document.createElement("div");
    typingElement.classList.add("message", "left", "typing-indicator");
    typingElement.innerHTML = `<strong>${user}</strong>: is typing...`;

    messageContainer.appendChild(typingElement); // Append to message container
    // Scroll to the bottom if the user is at the bottom
    if (isAtBottom) {
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }
};

// Hide typing indicator
const hideTyping = () => {
    const existingTypingIndicator = document.querySelector(".typing-indicator");
    if (existingTypingIndicator) {
        existingTypingIndicator.remove(); // Remove typing indicator from DOM
    }
};

// If a new user joins, receive their username from the server
socket.on("user-joined", (user) => {
    append("joined the chat", user, "center", "event");
    joinaudio.play();
    if (isAtBottom) {
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }
});

// If server sends a message, receive it!
socket.on("receive", (data) => {
    append(data.message, data.username, "left");
    receiveaudio.play();
    hideTyping(); // Hide typing indicator when message is received
    if (isAtBottom) {
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }
});

// If a user leaves the chat, append the info to the container
socket.on("left", (user) => {
    append("left the chat", user, "center", "event");
    leftaudio.play();
    if (isAtBottom) {
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }
});

// Listen for user list updates
socket.on("update-user-list", (users) => {
    updateUserList(users);
});

// Listen for typing events
socket.on("typing", (user) => {
    showTyping(user); // Show typing indicator
    clearTimeout(typingTimeout); // Reset typing timeout
    typingTimeout = setTimeout(() => {
        hideTyping(); // Hide after a timeout
        socket.emit("stop-typing"); // Notify server to stop typing
    }, 4000); // Adjust time as necessary
});

// Listen for stop typing events
socket.on("stop-typing", () => {
    hideTyping(); // Hide typing indicator
});

// Detect typing in the input field
messageInput.addEventListener("input", () => {
    if (messageInput.value.trim() !== "") {
        socket.emit("typing", username); // Notify server of typing
    } else {
        socket.emit("stop-typing"); // Notify server of stop typing
    }
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
    socket.emit("stop-typing"); // Stop typing indication after sending
    messageInput.value = ""; // Clear input
    sentaudio.play();
    // Re-focus the message input field
    messageInput.focus();
    if (isAtBottom) {
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }
});

// Add an event listener for scroll events
messageContainer.addEventListener("scroll", () => {
    // Check if the user is at the bottom
    isAtBottom =
        messageContainer.scrollHeight - messageContainer.clientHeight <=
        messageContainer.scrollTop + 50;
});
