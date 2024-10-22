# AR Chat App

AR Chat App is a real-time chat application that enables users to communicate through text messages. It leverages Socket.IO for real-time communication and is built with plain JavaScript on the client side.

## Features

-   Real-time messaging using Socket.IO
-   User identification with customizable usernames
-   Timestamped messages for better context
-   Audio alerts for different chat events

## Deployed Application

You can try out the AR Chat App without setting it up yourself! Access the live version at: [AR-Chat-App.vercel.app](https://ar-chat-app.vercel.app/)

(Frontend deployed on [Vercel](https://vercel.app/) and backend deployed on [Render](https://dashboard.render.com/))

## Prerequisites

-   Node.js (version 14 or higher)
-   A modern web browser
-   An internet connection

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/arunishrajput/ar-chat-app.git
    cd ar-chat-app
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables for `nodeServer`:**

    Create a `.env` file in the `nodeServer` folder of your project and add the following line, replacing `PORT_No`, `CLIENT_1_URL` and/or `CLIENT_2_URL` with your port no and actual client URLs you want to allow:

    ```bash
    PORT=PORT_No //example:8000
    CLIENT_1_URL=CLIENT_1_URL
    CLIENT_2_URL=CLIENT_2_URL
    ```

4. **Update the client-side code:**

    > **Note:** To get your `SOCKET SERVER URL`, you have to do [5th Step (Run the Server)](https://github.com/arunishrajput/AR-Chat-App?tab=readme-ov-file#:~:text=Run%20the%20application%3A)

    - **Update `client.js`:** In your client JavaScript file (`client.js`), modify the Socket.IO initialization URL with your actual SOCKET SERVER URL.
    - **Change the Socket.IO script source in `index.html`:** In your HTML file (`index.html`), update the Socket.IO script source to use the actual SOCKET SERVER URL. Change the following line:
        ```bash
        <script defer src="https://ar-chat-app-h1pj.onrender.com/socket.io/socket.io.js"></script> <!-- SOCKET SERVER URL -->
        ```
        To
        ```bash
        <script defer src="YOUR_SOCKET_SERVER_URL/socket.io/socket.io.js"></script> <!-- SOCKET SERVER URL -->
        ```
        Replace YOUR_SOCKET_SERVER_URL with your actual SOCKET SERVER URL.

5. **Run the application:**

    Start the server and get your `SOCKET SERVER URL`:

    ```bash
    node index.js
    ```

## Usage

1. Open the chat application in your browser.
2. Enter a username when prompted.
3. Start chatting with other users!

## Audio Notifications

The application includes audio notifications for different events:

-   Join sound when a new user joins the chat
-   Send sound when a message is sent
-   Receive sound when a message is received
-   Left sound when a user leaves the chat

## Contribution

-   Feel free to fork this repository, create a feature branch, and submit a pull request. Contributions, issues, and feature requests are welcome!

## Acknowledgments

-   [Socket.IO](https://socket.io/)
-   [Node.js](https://nodejs.org/)
