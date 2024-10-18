import Experience from "./Experience/Experience";
import "./index.scss";
import AgoraRTC from "agora-rtc-sdk-ng";
AgoraRTC.setLogLevel(4);
const appid = "712c5072d38945d2873615fc424a3bd4";
const token = null;
const rtcUid = Math.floor(Math.random() * 2032);
const speakerIcon = document.getElementById("speakerIcon");
const speakerDisableIcon = document.getElementById("speakerDisableIcon");
const socket = new Experience().socket;
let roomCode = "none"; 
let initialized = false;
socket.on("generateCode", (audioRoomCode, id) => {
  if(socket.id !== id) return;
  roomCode = audioRoomCode;
});

let audioTracks = {
  localAudioTrack: null,
  remoteAudioTracks: {},
};

let rtcClient;

let micMuted = true;

let initRtc = async () => {
  rtcClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  rtcClient.on("user-joined", handleUserJoined);
  rtcClient.on("user-published", handleUserPublished);
  rtcClient.on("user-left", handleUserLeft);
  await rtcClient.join(appid, roomCode, token, rtcUid);
  audioTracks.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  audioTracks.localAudioTrack.setMuted(micMuted);
  rtcClient.publish(audioTracks.localAudioTrack);
};

let handleUserJoined = async (user) => {
  console.log("A NEW USER IS JOINED", user);
};

let handleUserPublished = async (user, mediaType) => {
  await rtcClient.subscribe(user, mediaType);

  if (mediaType === "audio") {
    audioTracks.remoteAudioTracks[user.uid] = [user.audioTrack];
    user.audioTrack.play();
  }
};

let handleUserLeft = async (user) => {
  delete audioTracks.remoteAudioTracks[user.uid];
  document.getElementById(user.uid).remove();
};

speakerIcon.addEventListener("click", () => {
  speakerDisableIcon.style.display = "flex";
  speakerIcon.style.display = "none";
  micMuted = true;
  audioTracks.localAudioTrack.setMuted(micMuted);
});

// Displaying the speaker Disable Icon
speakerDisableIcon.addEventListener("click", async () => {
  if(!initialized) {
    try{
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await initRtc();
      initialized = true;
    } catch(error){
      console.error("Microphone access denied or error:", error);
      alert("Microphone access is required to use voice chat");
      return;
    }
  }
  speakerIcon.style.display = "flex";
  speakerDisableIcon.style.display = "none";
  micMuted = false;
  audioTracks.localAudioTrack.setMuted(micMuted);
});
