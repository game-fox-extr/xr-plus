import "./index.scss";
import Experience from "../frontend/Experience/Experience";

/* Getting all the chat elements and sockets */

const experience = new Experience();
const chatSocket = experience.chatSocket;
const experienceSocket = experience.socket;

//Chat bot elements
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
const chatWithOtherButton = document.getElementById("chatWithOtherButton");
const closeChatWithOtherModal = document.getElementById(
  "closeChatWithOtherModal"
);


/*Setting the current room */

let currentRoom =  "ZZZZZ";
experienceSocket.on("generateCode", (roomCode, id) => {
    if(id !== experienceSocket.id) return;
    currentRoom = roomCode;
    chatWithOtherInput.setAttribute("placeholder", roomCode)
});

/*******************************
ChatBot Event Listeners
********************************/


// Open the Chatbot Modal
chatbotImage.addEventListener("click", () => {
  if (chatWithOtherModal.style.display === "flex") {
    chatWithOtherModal.style.display = "none"; // Close chat with others modal if open
  }
  chatbotModal.style.display = "flex";
});

// Close Chatbot Modal by clicking outside
window.addEventListener("click", (event) => {
  if (event.target === chatbotModal) {
    chatbotModal.style.display = "none";
  }
});


// Close the Chatbot Modal
closeChatbotModal.addEventListener("click", () => {
  chatbotModal.style.display = "none";
});

// Event listener for submitting Chatbot form
form.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage();
});

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

/*******************************
Chat with Others Event Listeners
********************************/

// Close the Chat with Others Modal
closeChatWithOtherModal.addEventListener("click", () => {
  chatWithOtherModal.style.display = "none";
});
// Open the Chat with Others Modal
chatWithOtherImage.addEventListener("click", () => {
  if (chatbotModal.style.display === "flex") {
    chatbotModal.style.display = "none"; // Close chatbot modal if open
  }
  chatWithOtherModal.style.display = "flex";
});

chatWithOtherButton.addEventListener("click", onChatWithOtherSubmit);

// Close Chat with Others Modal by clicking outside
window.addEventListener("click", (event) => {
  if (event.target === chatWithOtherModal) {
    chatWithOtherModal.style.display = "none";
  }
});


// Event listener for submitting "Chat with Others" form

// Send message when the user submits the chat form
chatWithOtherForm.addEventListener("submit", onChatWithOtherSubmit) 


function onChatWithOtherSubmit(event){
  event.preventDefault();
  const message = chatWithOtherInput.value.trim();

  if (message === "") {
    alert("Please enter a message before sending.");
    return;
  }

  // Emit the message along with the current room to the backend
  chatSocket.emit("sendMessage", { message, roomName: currentRoom });

  // Clear the input field and display the user's message
  chatWithOtherHistory.innerHTML += `<div class="user-message">You: ${message}</div>`;
  chatWithOtherInput.value = ""; // Clear the input
  chatWithOtherHistory.scrollTop = chatWithOtherHistory.scrollHeight; // Scroll to the latest message
}
/*******************************
 Socket Connection Code
********************************/

// Listen for broadcasted messages from the server
chatSocket.on("broadcastMessage", (data) => {
  const { message, name } = data;

  // Display the message from the other user
  chatWithOtherHistory.innerHTML += `<div class="other-message">User ${name}: ${message}</div>`;
  chatWithOtherHistory.scrollTop = chatWithOtherHistory.scrollHeight; // Scroll to the latest message
});


