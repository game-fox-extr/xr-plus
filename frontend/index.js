import "./index.scss";
import { io } from "socket.io-client";
import Experience from "./Experience/Experience.js";
import elements from "./Experience/Utils/functions/elements.js";

// Dom Elements ----------------------------------

const domElements = elements({
  canvas: ".experience-canvas",
  //   chatContainer: ".chat-container",
  //   messageSubmitButton: "#chat-message-button",
  //   messageInput: "#chat-message-input",
  inputWrapper: ".message-input-wrapper",
  nameInputButton: "#name-input-button",
  nameInput: "#name-input",
  avatarLeftImg: ".avatar-left",
  avatarRightImg: ".avatar-right",
});

// Frontend Server ----------------------------------

const socketUrl = new URL("/", window.location.href);

const socket = io(socketUrl.toString());
const chatSocket = io(socketUrl.toString() + "chat");
const updateSocket = io(socketUrl.toString() + "update");
let userName = "";

// Experience ----------------------------------

const experience = new Experience(domElements.canvas, updateSocket);
// Sockets ----------------------------------

chatSocket.on("connect", () => {
  // console.log("Connected to server with ID" + chatSocket.id);
});
// domElements.canvas.addEventListener("click", () => document.querySelector('.experience-canvas').requestPointerLock());

// domElements.messageSubmitButton.addEventListener("click", handleMessageSubmit);
domElements.nameInputButton.addEventListener("click", handleNameSubmit);
// domElements.chatContainer.addEventListener("click", handleChatClick);
domElements.avatarLeftImg.addEventListener(
  "click",
  handleCharacterSelectionLeft
);
domElements.avatarRightImg.addEventListener(
  "click",
  handleCharacterSelectionRight
);
// document.addEventListener("keydown", handleMessageSubmit);

document.getElementById("lensImage").addEventListener("click", function () {
  alert("Proceed with Lens Experience!");
  window.open(
    "https://lens.snap.com/experience/6174e772-1d93-478f-bd13-fd4da3823b6f",
    "_blank"
  );
});

function handleChatClick() {
  if (domElements.inputWrapper.classList.contains("hidden"))
    domElements.inputWrapper.classList.remove("hidden");
}

function handleNameSubmit() {
  userName = domElements.nameInput.value;
  chatSocket.emit("setName", userName);
  updateSocket.emit("setName", userName);
}

function handleCharacterSelectionLeft() {
  updateSocket.emit("setAvatar", "male");

  domElements.avatarLeftImg.removeEventListener(
    "click",
    handleCharacterSelectionLeft
  );
}
function handleCharacterSelectionRight() {
  updateSocket.emit("setAvatar", "female");

  domElements.avatarRightImg.removeEventListener(
    "click",
    handleCharacterSelectionRight
  );
}

function handleMessageSubmit(event) {
  if (event.type === "click" || event.key === "Enter") {
    domElements.inputWrapper.classList.toggle("hidden");
    domElements.messageInput.focus();

    if (domElements.messageInput.value === "") return;
    displayMessage(
      userName,
      domElements.messageInput.value.substring(0, 500),
      getTime()
    );
    chatSocket.emit(
      "send-message",
      domElements.messageInput.value.substring(0, 500),
      getTime()
    );
    domElements.messageInput.value = "";
  }
}

function getTime() {
  const currentDate = new Date();
  const hours = currentDate.getHours().toString().padStart(2, "0");
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");
  const time = `${hours}:${minutes}`;
  return time;
}

function displayMessage(name, message, time) {
  const messageDiv = document.createElement("div");
  const messageSpan = document.createElement("span");
  messageSpan.classList.add("different-color");
  messageSpan.textContent = `[${time}] ${name}:`;
  messageDiv.appendChild(messageSpan);
  messageDiv.appendChild(document.createTextNode(` ${message}`));
  domElements.chatContainer.append(messageDiv);
  domElements.chatContainer.scrollTop = domElements.chatContainer.scrollHeight;
}

// Get data from server ----------------------------------

chatSocket.on("recieved-message", (name, message, time) => {
  displayMessage(name, message, time);
});

// Update Socket ----------------------------------------------------
updateSocket.on("connect", () => {});

const audio = document.getElementById("myAudio");

window.addEventListener("keydown", function (e) {
  if (e.code === "Equal") {
    if (!audio.paused) {
      audio.pause();
      audio.currentTime = 0;
    } else {
      audio.play();
    }
  }
});

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

// Speaker Icon dom elements

const speakerIcon = document.getElementById("speakerIcon");
const speakerDisableIcon = document.getElementById("speakerDisableIcon");

let currentRoom = "";

function closeAllModals() {
  domElements.chatbotModal.style.display = "none";
  domElements.chatWithOtherModal.style.display = "none";
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

// Displaying the speaker Disable Icon
speakerIcon.addEventListener("click", () => {
  speakerDisableIcon.style.display = "flex";
  speakerIcon.style.display = "none";
});

// Displaying the speaker Disable Icon
speakerDisableIcon.addEventListener("click", () => {
  speakerIcon.style.display = "flex";
  speakerDisableIcon.style.display = "none";
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

function isAnyModalOpen() {
  return (
    domElements.chatbotModal.style.display === "flex" ||
    domElements.chatWithOtherModal.style.display === "flex"
  );
}

document.addEventListener("click", (event) => {
  if (!isAnyModalOpen()) {
    domElements.canvas.requestPointerLock();
  }
});

document.addEventListener("keydown", (event) => {
  if (isAnyModalOpen()) {
    // Prevent player movement with "W", "A", "S", "D" when modal is open
    const blockedKeys = ["KeyW", "KeyA", "KeyS", "KeyD"];
    if (blockedKeys.includes(event.code)) {
      event.preventDefault();
    }
  }
});
