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
  nameInputButton: "#name-input-button",
  roomInput: "#room-input",
  roomInputButton: '#room-input-button',
  createButton: '.create-button',
  roomCodeDiv: '.room-code',
  avatarLeftImg: ".avatar-left",
  avatarRightImg: ".avatar-right",
});

window.mobileAndTabletCheck = function () {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};

// Frontend Server ----------------------------------
const socketUrl = new URL("/", window.location.href);
const socket = io(socketUrl.toString());
const chatSocket = io(socketUrl.toString() + "chat");
const updateSocket = io(socketUrl.toString() + "update");
let userName = "";
let isRecording;

// Experience ----------------------------------

const experience = new Experience(domElements.canvas, updateSocket);
// Sockets ----------------------------------

chatSocket.on("connect", () => {
  // console.log("Connected to server with ID" + chatSocket.id);
});
// domElements.canvas.addEventListener("click", () => document.querySelector('.experience-canvas').requestPointerLock());

updateSocket.on("generateCode", (roomCode, id) => {
  if(updateSocket.id !== id) return;
  domElements.roomCodeDiv.textContent = roomCode;
});


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

domElements.roomInputButton.addEventListener("click", handleJoin);
// document.addEventListener("keydown", handleMessageSubmit);
domElements.createButton.addEventListener('click', handleCreate);

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

function handleJoin() {
  const roomCode = domElements.roomInput.value;
  updateSocket.emit("joinRoom", roomCode);
}

function handleCreate() {
  updateSocket.emit("createRoom");
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