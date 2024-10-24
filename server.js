import express from "express";
import path from "path";
import http from "http";
import runChat from "./backend-modules/chatbot.js";
import { GameRoom, generateRoomCode } from "./backend-modules/rooms.js";

const ROOM_CODE_LENGTH = 6;

import { Server } from "socket.io";
import cors from "cors";

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: "*",
  },
});
app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

const indexPath = path.join(process.cwd(), "dist", "index.html");

app.get("/", (req, res) => {
  res.sendFile(indexPath);
});

app.post("/chat", async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    const isFashionChat = req.body?.isFashionChat || false;

    console.log("incoming /chat req", userInput, isFashionChat);
    if (!userInput) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    const response = await runChat(userInput, isFashionChat);
    const plainTextWithEmojis = response
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/\*/g, "");
    res.json({ response: plainTextWithEmojis });
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Chat Name Space ----------------------------------------

const chatNameSpace = io.of("/chat");

chatNameSpace.on("connection", (socket) => {
  socket.userData = {
    name: "",
  };
  console.log(`${socket.id} has connected to chat namespace`);

  socket.on("disconnect", () => {
    console.log(`${socket.id} has disconnected`);
  });

  socket.on("setName", (name) => {
    socket.userData.name = name;
  });

  socket.on("generateCode", (roomCode) => {
    socket.join(roomCode);
  });

  console.log(`New user connected: ${socket.id}`);
  // Listen for incoming messages from clients
  socket.on("sendMessage", ({ message, roomName }) => {
    console.log(`Message from ${socket.id} in room ${roomName}: ${message}`);

    // Broadcast the message to the room
    chatNameSpace.to(roomName).except(socket.id).emit("broadcastMessage", {
      message: message,
      name: socket.userData.name, // Include the socket ID to identify the sender
    });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Update Name Space ----------------------------------------
const updateNameSpace = io.of("/update");

const gameRooms = new Map();

updateNameSpace.on("connection", (socket) => {
  socket.userData = {
    position: { x: 0, y: -500, z: -500 },
    quaternion: { x: 0, y: 0, z: 0, w: 0 },
    animation: "idle",
    name: "",
    avatarSkin: "",
    roomCode: "",
  };

  console.log(`${socket.id} has connected to update namespace`);

  socket.on("setID", () => {
    updateNameSpace.emit("setID", socket.id);
  });

  socket.on("setName", (name) => {
    socket.userData.name = name;
  });

  socket.on("setAvatar", (avatarSkin) => {
    updateNameSpace.emit("setAvatarSkin", avatarSkin, socket.id);
  });

  socket.on("joinRoom", (roomCode) => {
    if (!gameRooms.has(roomCode)) {
      socket.emit("invalidRoomCode", "Not a valid room code.");
      console.log(`Invalid room code entered: ${roomCode}`); // Log for debugging
      return;
    }
    socket.userData.roomCode = roomCode;
    gameRooms.get(roomCode).addPlayer(socket);
    socket.join(roomCode);
    updateNameSpace.emit("generateCode", roomCode, socket.id);
  });

  socket.on("createRoom", () => {
    let newCode = generateRoomCode(ROOM_CODE_LENGTH);
    while (gameRooms.has(newCode)) {
      newCode = generateRoomCode(ROOM_CODE_LENGTH);
    }
    socket.userData.roomCode = newCode;
    gameRooms.set(newCode, new GameRoom(newCode));
    gameRooms.get(newCode).addPlayer(socket);
    console.log(`Room ${newCode} was created`);
    socket.join(newCode);
    updateNameSpace.emit("generateCode", newCode, socket.id);
  });

  socket.on("disconnecting", () => {
    const roomCode = socket?.userData?.roomCode;
    if(roomCode){
      const room = gameRooms.get(roomCode);
      room.removePlayer(socket);
      if (room.numPlayers === 0) {
        gameRooms.delete(roomCode);
        console.log(roomCode + ' no longer exists');
      }
    }
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} has disconnected`);
    updateNameSpace.emit("removePlayer", socket.id);
  });

  socket.on("initPlayer", (player) => {
    // console.log(player);
  });

  socket.on("updatePlayer", (player) => {
    socket.userData.position.x = player.position.x;
    socket.userData.position.y = player.position.y;
    socket.userData.position.z = player.position.z;
    socket.userData.quaternion.x = player.quaternion[0];
    socket.userData.quaternion.y = player.quaternion[1];
    socket.userData.quaternion.z = player.quaternion[2];
    socket.userData.quaternion.w = player.quaternion[3];
    socket.userData.animation = player.animation;
    socket.userData.avatarSkin = player.avatarSkin;
  });

  setInterval(() => {
    for (const gameRoom of gameRooms.values()) {
      const playerData = [];
      for (const socket of gameRoom.playerSockets.values()) {
        if (socket.userData.name !== "" && socket.userData.avatarSkin !== "") {
          playerData.push({
            id: socket.id,
            name: socket.userData.name,
            position_x: socket.userData.position.x,
            position_y: socket.userData.position.y,
            position_z: socket.userData.position.z,
            quaternion_x: socket.userData.quaternion.x,
            quaternion_y: socket.userData.quaternion.y,
            quaternion_z: socket.userData.quaternion.z,
            quaternion_w: socket.userData.quaternion.w,
            animation: socket.userData.animation,
            avatarSkin: socket.userData.avatarSkin,
          });
        }
      }

      if (socket.userData.name === "" || socket.userData.avatarSkin === "") {
        return;
      } else {
        updateNameSpace.to(gameRoom.roomCode).emit("playerData", playerData);
      }
    }
  }, 20);
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


io.on("connection", (socket) => {
});
