import "./index.scss";
import { io } from "socket.io-client";
const chatbotImage = document.getElementById("chatbotImage");
const chatWithOtherImage = document.getElementById("chatWithOtherImage");
const chatWithOtherModal = document.getElementById("chatWithOtherModal");
const chatbotModal = document.getElementById("chatbotModal");
const closeChatbotModal = document.getElementById("closeChatbotModal");
const chatHistory = document.getElementById("chat-history");
const userInput = document.getElementById("user-input");
const form = document.getElementById("chat-form");
const submitButton = form.querySelector("button");

// Chat with Others elements
const chatWithOtherHistory = document.getElementById("chatWithOtherHistory");
const chatWithOtherInput = document.getElementById("chatWithOtherInput");
const chatWithOtherForm = document.getElementById("chatWithOtherForm");
const chatWithOtherLoader = document.getElementById("chatWithOtherLoader");
const closeChatWithOtherModal = document.getElementById(
  "closeChatWithOtherModal"
);
const joinRoomButton = document.getElementById("joinRoomButton");
const chatWithOtherRoomInput = document.getElementById(
  "chatWithOtherRoomInput"
);
const chatWithOtherRoomForm = document.getElementById("chatWithOtherRoomForm");
const socketUrl = new URL("/", window.location.href);
const socket = io(socketUrl.toString());
// Speaker Icon dom elements

const speakerIcon = document.getElementById("speakerIcon");
const speakerDisableIcon = document.getElementById("speakerDisableIcon");

let currentRoom = "";
let userName = "";

function closeAllModals() {
  chatbotModal.style.display = "none";
  chatWithOtherModal.style.display = "none";
}

// Open the Chatbot Modal
chatbotImage.addEventListener("click", () => {
  if (chatWithOtherModal.style.display === "flex") {
    chatWithOtherModal.style.display = "none"; // Close chat with others modal if open
  }
  chatbotModal.style.display = "flex";
});

// Open the Chat with Others Modal
chatWithOtherImage.addEventListener("click", () => {
  if (chatbotModal.style.display === "flex") {
    chatbotModal.style.display = "none"; // Close chatbot modal if open
  }
  chatWithOtherModal.style.display = "flex";
});

// Close the Chatbot Modal
closeChatbotModal.addEventListener("click", () => {
  chatbotModal.style.display = "none";
});

// Close the Chat with Others Modal
closeChatWithOtherModal.addEventListener("click", () => {
  chatWithOtherModal.style.display = "none";
});

// Close Chat with Others Modal by clicking outside
window.addEventListener("click", (event) => {
  if (event.target === chatWithOtherModal) {
    chatWithOtherModal.style.display = "none";
  }
});

// Close Chatbot Modal by clicking outside
window.addEventListener("click", (event) => {
  if (event.target === chatbotModal) {
    dchatbotModal.style.display = "none";
  }
});

// Send message in Chat with Others modal
async function sendChatWithOtherMessage() {
  const userMessage = chatWithOtherInput.value.trim();
  const roomName = chatWithOtherRoomInput.value.trim();

  // Check if user has entered a room
  if (!roomName) {
    alert("Please enter a room name before sending a message.");
    return;
  }

  // Check if message is empty
  if (userMessage === "") {
    alert("Please enter a message before sending.");
    return;
  }

  // Clear input field and disable controls
  chatWithOtherInput.value = "";
  chatWithOtherInput.disabled = true;
  chatWithOtherForm.querySelector("button").disabled = true;
  chatWithOtherLoader.style.display = "block";

  // Display the user's message immediately
  chatWithOtherHistory.innerHTML += `<div class="user-message">${userMessage}</div>`;
  chatWithOtherHistory.scrollTop = chatWithOtherHistory.scrollHeight;

  try {
    // Send the message to the backend
    const response = await fetch(
      "https://stratergy-fox-backend.onrender.com/chatWithOthers",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput: userMessage, roomName }), // Added roomName in the request
      }
    );

    const data = await response.json();
    const botMessage = data.response;

    // Display the bot's message
    chatWithOtherHistory.innerHTML += `<div class="bot-message">${botMessage}</div>`;
    chatWithOtherHistory.scrollTop = chatWithOtherHistory.scrollHeight;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Re-enable input and controls
    chatWithOtherInput.disabled = false;
    chatWithOtherForm.querySelector("button").disabled = false;
    chatWithOtherInput.focus();
    chatWithOtherLoader.style.display = "none";
  }
}

// Event listener for submitting "Chat with Others" form
chatWithOtherRoomForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const roomName = chatWithOtherRoomInput.value.trim();

  if (roomName === "") {
    alert("Please enter a room name.");
    return;
  }

  currentRoom = roomName;

  // Emit the room name to the backend to join the room
  socket.emit("joinRoom", roomName);
  console.log(roomName);

  // Clear input field and show the room name in the chat history
  chatWithOtherRoomInput.value = "";
  chatWithOtherHistory.innerHTML += `<div class="system-message">You joined room: ${roomName}</div>`;
});

// Send message when the user submits the chat form
chatWithOtherForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = chatWithOtherInput.value.trim();

  if (message === "") {
    alert("Please enter a message before sending.");
    return;
  }

  // Emit the message along with the current room to the backend
  socket.emit("sendMessage", { message, roomName: currentRoom });

  // Clear the input field and display the user's message
  chatWithOtherHistory.innerHTML += `<div class="user-message">You: ${message}</div>`;
  chatWithOtherInput.value = ""; // Clear the input
  chatWithOtherHistory.scrollTop = chatWithOtherHistory.scrollHeight; // Scroll to the latest message
});

// socket connection code

// Listen for broadcasted messages from the server
socket.on("broadcastMessage", (data) => {
  const { message, id } = data;

  // Display the message from the other user
  chatWithOtherHistory.innerHTML += `<div class="other-message">User ${id.slice(
    0,
    5
  )}: ${message}</div>`;
  chatWithOtherHistory.scrollTop = chatWithOtherHistory.scrollHeight; // Scroll to the latest message
});

// Listen for system messages (e.g., notifications when a user joins)
socket.on("message", (systemMessage) => {
  chatWithOtherHistory.innerHTML += `<div class="system-message">${systemMessage}</div>`;
  chatWithOtherHistory.scrollTop = chatWithOtherHistory.scrollHeight; // Scroll to the latest message
});

// Send message in Chatbot modal
async function sendMessage() {
  const userMessage = userInput.value.trim();

  // Check if message is empty
  if (userMessage === "") {
    alert("Please enter a message before sending.");
    return;
  }

  // Clear input field and disable controls
  userInput.value = "";
  userInput.disabled = true;
  submitButton.disabled = true;

  const loader = document.getElementById("loader");
  loader.style.display = "block";

  // Display the user's message immediately
  chatHistory.innerHTML += `<div class="user-message">${userMessage}</div>`;
  chatHistory.scrollTop = chatHistory.scrollHeight;

  try {
    // Send the message to the backend
    const response = await fetch(
      "https://stratergy-fox-backend.onrender.com/chat",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput: userMessage }),
      }
    );

    const data = await response.json();
    const botMessage = data.response;

    // Display the bot's message
    chatHistory.innerHTML += `<div class="bot-message">${botMessage}</div>`;
    chatHistory.scrollTop = chatHistory.scrollHeight;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Re-enable input and controls
    userInput.disabled = false;
    submitButton.disabled = false;
    userInput.focus();
    loader.style.display = "none";
  }
}

// Event listener for submitting Chatbot form
form.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage();
});
