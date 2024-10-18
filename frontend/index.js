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
const chatSocket = io(socketUrl.toString() + "chat");
const updateSocket = io(socketUrl.toString() + "update");

// Experience ----------------------------------

const experience = new Experience(domElements.canvas, updateSocket, chatSocket);
// Sockets ----------------------------------

chatSocket.on("connect", () => {
  // console.log("Connected to server with ID" + chatSocket.id);
});
// domElements.canvas.addEventListener("click", () => document.querySelector('.experience-canvas').requestPointerLock());

updateSocket.on("generateCode", (roomCode, id) => {
  if(updateSocket.id !== id) return;
  chatSocket.emit("generateCode", roomCode);
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

function handleNameSubmit() {
  const userName = domElements.nameInput.value;
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

function getTime() {
  const currentDate = new Date();
  const hours = currentDate.getHours().toString().padStart(2, "0");
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");
  const time = `${hours}:${minutes}`;
  return time;
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
