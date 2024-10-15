import * as THREE from "three";
import Experience from "../../Experience.js";
import { Capsule } from "three/examples/jsm/math/Capsule";

import nipplejs from "nipplejs";
import elements from "../../Utils/functions/elements.js";
import Avatar from "./Avatar.js";

export default class Player {
  constructor() {
    this.experience = new Experience();
    this.time = this.experience.time;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.octree = this.experience.world.octree;
    this.resources = this.experience.resources;
    this.socket = this.experience.socket;

    this.domElements = elements({
      joystickArea: ".joystick-area",
      controlOverlay: ".control-overlay",
      messageInput: "#chat-message-input",
      switchViewButton: ".switch-camera-view",
    });

    this.initPlayer();
    this.initControls();
    this.setPlayerSocket();
    this.setJoyStick();
    this.addEventListeners();
  }

  initPlayer() {
    this.player = {};

    this.player.body = this.camera.perspectiveCamera;
    this.player.animation = "idle";

    this.jumpOnce = false;
    this.player.onFloor = false;
    this.player.gravity = 60;

    this.player.spawn = {
      position: new THREE.Vector3(),
      rotation: new THREE.Euler(),
      velocity: new THREE.Vector3(),
    };

    this.player.raycaster = new THREE.Raycaster();
    this.player.raycaster.far = 10;

    this.player.height = 1.2;
    this.player.speedMultiplier = 0.35;
    this.player.position = new THREE.Vector3();
    this.player.quaternion = new THREE.Euler();
    this.player.directionOffset = 0;
    this.targetRotation = new THREE.Quaternion();

    this.upVector = new THREE.Vector3(0, 1, 0);
    this.player.velocity = new THREE.Vector3();
    this.player.direction = new THREE.Vector3();

    this.player.collider = new Capsule(
      new THREE.Vector3(),
      new THREE.Vector3(),
      0.35
    );

    this.otherPlayers = {};

    this.socket.emit("setID");
    this.socket.emit("initPlayer", this.player);
    this.lastRaycast = this.time.current;
  }

  initControls() {
    this.actions = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      jump: false,
      run: false,
      dance: false,
      movingJoyStick: false,
    };

    this.coords = {
      previousX: 0,
      previousY: 0,
      currentX: 0,
      currentY: 0,
    };

    this.joystickVector = new THREE.Vector3();
  }

  immoblizePlayer() {
    console.log("unfocused");
    this.player.animation = "idle";
    const actions = Object.keys(this.actions);
    for (let action of actions) {
      this.actions[action] = false;
    }
  }

  setJoyStick() {
    this.options = {
      zone: this.domElements.joystickArea,
      mode: "dynamic",
    };
    this.joystick = nipplejs.create(this.options);

    this.joystick.on("move", (e, data) => {
      this.actions.movingJoyStick = true;
      this.joystickVector.z = -data.vector.y;
      this.joystickVector.x = data.vector.x;
      this.player.animation = "walking";
    });

    this.joystick.on("end", () => {
      this.actions.movingJoyStick = false;
      this.player.animation = "idle";
    });
  }

  setPlayerSocket() {
    this.socket.on("setID", (setID, name) => {});

    this.socket.on("setAvatarSkin", (avatarSkin, id) => {
      if (!this.avatar && id === this.socket.id) {
        this.player.avatarSkin = avatarSkin;
        this.avatar = new Avatar(this.resources.items[avatarSkin], this.scene);
        this.updatePlayerSocket();
      }
    });

    this.socket.on("playerData", (playerData) => {
      for (let player of playerData) {
        if (player.id !== this.socket.id) {
          this.scene.traverse((child) => {
            if (child.userData.id === player.id) {
              return;
            } else {
              if (!this.otherPlayers.hasOwnProperty(player.id)) {
                if (player.name === "" || player.avatarSkin === "") {
                  return;
                }

                const name = player.name.substring(0, 25);

                const newAvatar = new Avatar(
                  this.resources.items[player.avatarSkin],
                  this.scene,
                  name,
                  player.id
                );

                player.model = newAvatar;
                this.otherPlayers[player.id] = player;
              }
            }
          });
          if (this.otherPlayers[player.id]) {
            this.otherPlayers[player.id].position = {
              position_x: player.position_x,
              position_y: player.position_y,
              position_z: player.position_z,
            };
            this.otherPlayers[player.id].quaternion = {
              quaternion_x: player.quaternion_x,
              quaternion_y: player.quaternion_y,
              quaternion_z: player.quaternion_z,
              quaternion_w: player.quaternion_w,
            };
            this.otherPlayers[player.id].animation = {
              animation: player.animation,
            };
          }
        }
      }
    });

    this.socket.on("removePlayer", (id) => {
      this.disconnectedPlayerId = id;

      this.otherPlayers[id].model.nametag.material.dispose();
      this.otherPlayers[id].model.nametag.geometry.dispose();
      this.scene.remove(this.otherPlayers[id].model.nametag);

      this.otherPlayers[id].model.avatar.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material.dispose();
          child.geometry.dispose();
        }

        if (child.material) {
          child.material.dispose();
        }

        if (child.geometry) {
          child.geometry.dispose();
        }
      });

      this.scene.remove(this.otherPlayers[id].model.avatar);

      delete this.otherPlayers[id].nametag;
      delete this.otherPlayers[id].model;
      delete this.otherPlayers[id];
    });
  }

  updatePlayerSocket() {
    setInterval(() => {
      if (this.avatar) {
        this.socket.emit("updatePlayer", {
          position: this.avatar.avatar.position,
          quaternion: this.avatar.avatar.quaternion,
          animation: this.player.animation,
          avatarSkin: this.player.avatarSkin,
        });
      }
    }, 20);
  }

  onKeyDown = (e) => {
    if (document.activeElement === this.domElements.messageInput) return;

    switch (e.code) {
      case "KeyW":
      case "ArrowUp":
        this.actions.forward = true;
        this.actions.dance = false;
        break;

      case "KeyS":
      case "ArrowDown":
        this.actions.backward = true;
        this.actions.dance = false;
        break;

      case "KeyA":
      case "ArrowLeft":
        this.actions.left = true;
        this.actions.dance = false;
        break;

      case "KeyD":
      case "ArrowRight":
        this.actions.right = true;
        this.actions.dance = false;
        break;

      case "KeyC":
        if (!this.camera.togglable) return;
        if (!this.camera.thirdPerson) {
          this.camera.enableThirdPerson();
          document.exitPointerLock();
          const canvas = document.querySelector(".experience-canvas");
          canvas.removeEventListener("pointerdown", this.onPointerDown);
          canvas.classList.toggle("grab");
        } else {
          this.camera.disableThirdPerson();
          const canvas = document.querySelector(".experience-canvas");
          canvas.addEventListener("pointerdown", this.onPointerDown);
          canvas.classList.toggle("grab");
        }
        this.camera.togglable = false;
        return;
        break;

      case "KeyO":
        this.actions.dance = true;
        break;

      case "ShiftLeft":
        this.actions.run = true;
        this.player.animation = "running";
        break;

      case "Space":
        if (!this.actions.jump && this.player.onFloor) {
          this.actions.jump = true;
          this.player.animation = "jumping";
          this.jumpOnce = true;
          this.actions.dance = false;
        }
        break;

      default:
        return;
        break;
    }
    if (
      !(
        this.actions.forward ||
        this.actions.backward ||
        this.actions.left ||
        this.actions.right ||
        (this.actions.jump && !this.jumpOnce)
      ) &&
      this.actions.dance
    )
      this.player.animation = "dancing";

    if (!this.actions.run && !this.actions.jump && !this.actions.dance) {
      this.player.animation = "walking";
    }
  };

  onKeyUp = (e) => {
    switch (e.code) {
      case "KeyW":
      case "ArrowUp":
        this.actions.forward = false;
        break;

      case "KeyS":
      case "ArrowDown":
        this.actions.backward = false;
        break;

      case "KeyA":
      case "ArrowLeft":
        this.actions.left = false;
        break;

      case "KeyD":
      case "ArrowRight":
        this.actions.right = false;
        break;

      case "KeyC":
        this.camera.togglable = true;
        break;

      case "ShiftLeft":
        this.actions.run = false;
        break;

      case "Space":
        this.actions.jump = false;
        break;

      default:
        return;
        break;
    }

    if (this.player.onFloor) {
      if (this.actions.run) {
        this.player.animation = "running";
      } else if (
        this.actions.forward ||
        this.actions.backward ||
        this.actions.left ||
        this.actions.right
      ) {
        this.player.animation = "walking";
      } else {
        this.player.animation = "idle";
      }
    }
  };

  playerCollisions() {
    const result = this.octree.capsuleIntersect(this.player.collider);
    this.player.onFloor = false;

    if (result) {
      this.player.onFloor = result.normal.y > 0;

      this.player.collider.translate(
        result.normal.multiplyScalar(result.depth)
      );
    }
  }

  getForwardVector() {
    this.camera.perspectiveCamera.getWorldDirection(this.player.direction);
    this.player.direction.y = 0;
    this.player.direction.normalize();

    return this.player.direction;
  }

  getSideVector() {
    this.camera.perspectiveCamera.getWorldDirection(this.player.direction);
    this.player.direction.y = 0;
    this.player.direction.normalize();
    this.player.direction.cross(this.camera.perspectiveCamera.up);

    return this.player.direction;
  }

  getJoyStickDirectionalVector() {
    let returnVector = new THREE.Vector3();
    returnVector.copy(this.joystickVector);

    returnVector.applyQuaternion(this.camera.perspectiveCamera.quaternion);
    returnVector.y = 0;
    returnVector.multiplyScalar(1.5);

    return returnVector;
  }

  addEventListeners() {
    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);
    const canvas = document.querySelector(".experience-canvas");
    if (!window.mobileAndTabletCheck())
      canvas.addEventListener("pointerdown", this.onPointerDown);
    canvas.addEventListener("pointermove", (e) => {
      if (e.pointerType === "touch") {
        this.onMobileDeviceMove(e);
      } else {
        this.onDesktopPointerMove(e);
      }
    });
    canvas.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".joystick-area")) return;
      if (e.pointerType === "touch") {
        this.firstTouch = true;
        this.startX = e.pageX;
        this.startY = e.pageY;
        this.isSwiping = false;
      }
    });

    canvas.addEventListener("pointerup", (e) => {
      if (e.pointerType === "touch") {
        this.isSwiping = false;
        this.firstTouch = true;
      }
    });
    this.immoblizePlayer = this.immoblizePlayer.bind(this);
    this.mobilizePlayer = this.mobilizePlayer.bind(this);
    window.addEventListener("blur", this.immoblizePlayer);
    window.addEventListener("focus", this.mobilizePlayer);
  }

  onPointerDown = (e) => {
    const timeElapsed = this.time.current - this.lastRaycast;
    const RAYCAST_COOLDOWN = 1000;
    document.querySelector(".experience-canvas").requestPointerLock();

    if (timeElapsed > RAYCAST_COOLDOWN) {
      this.current = this.lastRaycast;
      this.raycast();
    }
  };

  onDesktopPointerMove = (e) => {
    if (
      document.pointerLockElement !==
      document.querySelector(".experience-canvas")
    )
      return;
    console.log("moved");
    this.player.body.rotation.order = "YXZ";
    this.player.body.rotation.x -= e.movementY / 500;
    this.player.body.rotation.y -= e.movementX / 500;

    this.player.body.rotation.x = THREE.MathUtils.clamp(
      this.player.body.rotation.x,
      -Math.PI / 2,
      Math.PI / 2
    );
  };

  mobilizePlayer() {
    console.log("Focused");
  }

  onMobileDeviceMove(e) {
    if (e.target.closest(".joystick-area")) return;

    if (this.firstTouch) {
      this.startX = e.pageX;
      this.startY = e.pageY;
      this.firstTouch = false;
    } else {
      const diffX = e.pageX - this.startX;
      const diffY = e.pageY - this.startY;

      this.player.body.rotation.order = "YXZ";
      this.player.body.rotation.y -= diffX / 200;
      this.player.body.rotation.x -= diffY / 200;

      this.player.body.rotation.x = THREE.MathUtils.clamp(
        this.player.body.rotation.x,
        -Math.PI / 2,
        Math.PI / 2
      );

      this.startX = e.pageX;
      this.startY = e.pageY;

      this.isSwiping = true;
    }
  }

  resize() {}

  spawnPlayerOutOfBounds() {
    const spawnPos = new THREE.Vector3(7.4437, 8 + 5, 59.0529);
    this.player.velocity = this.player.spawn.velocity;

    this.player.collider.start.copy(spawnPos);
    this.player.collider.end.copy(spawnPos);

    this.player.collider.end.y += this.player.height;
  }

  updateColliderMovement() {
    const speed =
      (this.player.onFloor ? 1.75 : 0.1) *
      this.player.gravity *
      this.player.speedMultiplier;

    let speedDelta = this.time.delta * speed;

    if (this.actions.movingJoyStick) {
      this.player.velocity.add(this.getJoyStickDirectionalVector());
    }

    if (this.actions.run) {
      speedDelta *= 2.5;
    }

    if (this.actions.forward) {
      this.player.velocity.add(
        this.getForwardVector().multiplyScalar(speedDelta)
      );
    }
    if (this.actions.backward) {
      this.player.velocity.add(
        this.getForwardVector().multiplyScalar(-speedDelta)
      );
    }
    if (this.actions.left) {
      this.player.velocity.add(
        this.getSideVector().multiplyScalar(-speedDelta)
      );
    }
    if (this.actions.right) {
      this.player.velocity.add(this.getSideVector().multiplyScalar(speedDelta));
    }

    if (this.player.onFloor) {
      if (this.actions.jump && this.jumpOnce) {
        this.player.velocity.y = 12;
      }
      this.jumpOnce = false;
    }

    let damping = Math.exp(-15 * this.time.delta) - 1;

    if (!this.player.onFloor) {
      if (this.player.animation === "jumping") {
        this.player.velocity.y -= this.player.gravity * 0.7 * this.time.delta;
      } else {
        this.player.velocity.y -= this.player.gravity * this.time.delta;
      }
      damping *= 0.1;
    }

    this.player.velocity.addScaledVector(this.player.velocity, damping);

    const deltaPosition = this.player.velocity
      .clone()
      .multiplyScalar(this.time.delta);

    this.player.collider.translate(deltaPosition);
    this.playerCollisions();

    this.player.body.position.sub(this.camera.controls.target);
    this.camera.controls.target.copy(this.player.collider.end);
    this.player.body.position.add(this.player.collider.end);

    this.player.body.updateMatrixWorld();

    if (this.player.body.position.y < -20) {
      console.log(`Spswning: ${this.player.body.position.y}`);
      this.spawnPlayerOutOfBounds();
    }
  }

  setInteractionObjects(interactionObjects) {
    this.player.interactionObjects = interactionObjects;
  }

  getgetCameraLookAtDirectionalVector() {
    const direction = new THREE.Vector3(0, 0, -1);
    return direction.applyQuaternion(this.camera.perspectiveCamera.quaternion);
  }

  // updateRaycaster() {
  //   this.player.raycaster.ray.origin.copy(
  //     this.camera.perspectiveCamera.position
  //   );

  //   this.player.raycaster.ray.direction.copy(
  //     this.getgetCameraLookAtDirectionalVector()
  //   );

  //   const intersects = this.player.raycaster.intersectObjects(
  //     this.player.interactionObjects.children
  //   );

  //   if (intersects.length === 0) {
  //     this.currentIntersectObject = "";
  //   } else {
  //     this.currentIntersectObject = intersects[0].object.name;
  //   }

  //   if (this.currentIntersectObject !== this.previousIntersectObject) {
  //     this.previousIntersectObject = this.currentIntersectObject;
  //   }
  // }

  raycast() {
    // Set raycaster from the camera
    this.player.raycaster.setFromCamera(
      { x: 0, y: 0 },
      this.camera.perspectiveCamera
    );

    // Check for intersections with objects in the scene
    const intersects = this.player.raycaster.intersectObjects(
      this.experience.scene.children,
      true
    );

    console.log(intersects[0]);
    // UUID and name to match
    const targetObjects = [
      {
        uuid: "47676f83-ba31-4804-8b94-89e1512e32cc",
        name: "Dress_F2_0",
        productId: 8637689462996,
      },
      {
        uuid: "f700d2b0-54bb-4006-9ea3-387911127477",
        name: "Pattern2D_15970001_D1_0",
        productId: 8637689462996,
      },
      {
        uuid: "ed238f4e-d667-4385-a492-c4d9346c1646",
        name: "D1_MD1_0",
        productId: 8637689462996,
      },
      {
        uuid: "e919308a-3b4e-4550-a58e-8ca8b58d5522",
        name: "jeans",
        productId: 8629642002644,
      },
      {
        uuid: "e919308a-3b4e-4550-a58e-8ca8b58d5522",
        name: "MANEQUIM_1",
        productId: 8629642002644,
      },
    ];

    const sauseObjects = [
      {
        uuid: null,
        name: "BluOrngSunsetA001",
        url: "https://lens.snap.com/experience/6174e772-1d93-478f-bd13-fd4da3823b6f",
      },
      {
        uuid: null,
        name: "Hoodie_MD",
        url: "https://lens.snap.com/experience/abb21f5b-1163-40df-80df-90542fc8310f",
      },
    ];

    for (let i = 0; i < intersects.length; i++) {
      console.log(intersects[i]);
      const object = intersects[i].object;

      const isTargetObject = targetObjects.some(
        (target) => object.name === target.name
      );

      const targetSauseObject = sauseObjects.find(
        (target) => object.name === target.name
      );

      if (isTargetObject) {
        // Find the product id of target with the same name as object
        var productId = "";
        targetObjects.forEach((target) => {
          if (target.name === object.name) {
            productId = target.productId;
            return;
          }
        });
        if (productId != null) showModal(productId);
        break; // Exit loop after first match
      }

      if (targetSauseObject) {
        // Check if the object is the hoodie and if it's at the specific position
        if (object.name === "Hoodie_MD") {
          // Open modal
          showModal(8629642002644);
        } else if (object.name === "BluOrngSunsetA001") {
          showModal(8629583904980);
        } else {
          // Update the UUID in sauseObjects if it's null
          if (!targetSauseObject.uuid) {
            targetSauseObject.uuid = object.uuid;
          }

          // Release pointer lock
          document.exitPointerLock();

          // Show an alert
          alert("You are being redirected to a new page.");

          // Redirect to the URL after alert is acknowledged
          window.location = targetSauseObject.url;
        }

        break; // Exit loop after first match
      }
    }
  }

  updateAvatarPosition() {
    this.avatar.avatar.position.copy(this.player.collider.end);
    this.avatar.avatar.position.y -= 1.56;

    this.avatar.animation.update(this.time.delta);
  }

  updateOtherPlayers() {
    for (let player in this.otherPlayers) {
      this.otherPlayers[player].model.avatar.position.set(
        this.otherPlayers[player].position.position_x,
        this.otherPlayers[player].position.position_y,
        this.otherPlayers[player].position.position_z
      );

      this.otherPlayers[player].model.animation.play(
        this.otherPlayers[player].animation.animation
      );

      this.otherPlayers[player].model.animation.update(this.time.delta);

      this.otherPlayers[player].model.avatar.quaternion.set(
        this.otherPlayers[player].quaternion.quaternion_x,
        this.otherPlayers[player].quaternion.quaternion_y,
        this.otherPlayers[player].quaternion.quaternion_z,
        this.otherPlayers[player].quaternion.quaternion_w
      );

      this.otherPlayers[player].model.nametag.position.set(
        this.otherPlayers[player].position.position_x,
        this.otherPlayers[player].position.position_y + 2.1,
        this.otherPlayers[player].position.position_z
      );
    }
  }

  updateAvatarRotation() {
    if (this.actions.movingJoyStick) {
      this.player.directionOffset = Math.atan2(
        this.joystickVector.x,
        this.joystickVector.z
      );
    }

    if (this.actions.forward) {
      this.player.directionOffset = Math.PI;
    }
    if (this.actions.backward) {
      this.player.directionOffset = 0;
    }

    if (this.actions.left) {
      this.player.directionOffset = -Math.PI / 2;
    }

    if (this.actions.forward && this.actions.left) {
      this.player.directionOffset = Math.PI + Math.PI / 4;
    }
    if (this.actions.backward && this.actions.left) {
      this.player.directionOffset = -Math.PI / 4;
    }

    if (this.actions.right) {
      this.player.directionOffset = Math.PI / 2;
    }

    if (this.actions.forward && this.actions.right) {
      this.player.directionOffset = Math.PI - Math.PI / 4;
    }
    if (this.actions.backward && this.actions.right) {
      this.player.directionOffset = Math.PI / 4;
    }

    if (this.actions.forward && this.actions.left && this.actions.right) {
      this.player.directionOffset = Math.PI;
    }
    if (this.actions.backward && this.actions.left && this.actions.right) {
      this.player.directionOffset = 0;
    }

    if (this.actions.right && this.actions.backward && this.actions.forward) {
      this.player.directionOffset = Math.PI / 2;
    }

    if (this.actions.left && this.actions.backward && this.actions.forward) {
      this.player.directionOffset = -Math.PI / 2;
    }
  }

  updateAvatarAnimation() {
    if (this.player.animation !== this.avatar.animation) {
      if (
        this.actions.left &&
        this.actions.right &&
        !this.actions.forward &&
        !this.actions.backward
      ) {
        this.player.animation = "idle";
      }

      if (
        !this.actions.left &&
        !this.actions.right &&
        this.actions.forward &&
        this.actions.backward
      ) {
        this.player.animation = "idle";
      }

      if (
        this.actions.left &&
        this.actions.right &&
        this.actions.forward &&
        this.actions.backward
      ) {
        this.player.animation = "idle";
      }

      if (
        !this.actions.left &&
        !this.actions.right &&
        !this.actions.forward &&
        !this.actions.backward &&
        this.actions.run
      ) {
        this.player.animation = "idle";
      }

      if (
        this.actions.run &&
        this.actions.left &&
        this.actions.right &&
        this.actions.forward &&
        !this.actions.backward
      ) {
        this.player.animation = "running";
      }

      if (
        this.actions.run &&
        this.actions.left &&
        this.actions.right &&
        this.actions.backward &&
        !this.actions.forward
      ) {
        this.player.animation = "running";
      }

      if (
        this.actions.run &&
        !this.actions.left &&
        !this.actions.right &&
        this.actions.forward &&
        !this.actions.backward &&
        this.player.animation !== "jumping"
      ) {
        this.player.animation = "running";
      }

      if (
        this.actions.run &&
        !this.actions.left &&
        !this.actions.right &&
        this.actions.backward &&
        !this.actions.forward &&
        this.player.animation !== "jumping"
      ) {
        this.player.animation = "running";
      }

      if (
        this.actions.run &&
        !this.actions.left &&
        !this.actions.right &&
        this.actions.backward &&
        this.actions.forward &&
        this.player.animation !== "jumping"
      ) {
        this.player.animation = "idle";
      }

      if (
        this.actions.run &&
        this.actions.left &&
        this.actions.right &&
        !this.actions.backward &&
        !this.actions.forward &&
        this.player.animation !== "jumping"
      ) {
        this.player.animation = "idle";
      }

      if (
        this.actions.run &&
        !this.actions.left &&
        this.actions.right &&
        !this.actions.backward &&
        this.actions.forward &&
        this.player.animation !== "jumping"
      ) {
        this.player.animation = "running";
      }

      if (
        this.actions.run &&
        this.actions.left &&
        !this.actions.right &&
        this.actions.backward &&
        !this.actions.forward &&
        this.player.animation !== "jumping"
      ) {
        this.player.animation = "running";
      }
      if (
        this.actions.run &&
        this.actions.left &&
        !this.actions.right &&
        !this.actions.backward &&
        !this.actions.forward &&
        this.player.animation !== "jumping"
      ) {
        this.player.animation = "running";
      }
      if (
        this.actions.run &&
        !this.actions.left &&
        this.actions.right &&
        !this.actions.backward &&
        !this.actions.forward &&
        this.player.animation !== "jumping"
      ) {
        this.player.animation = "running";
      }

      if (
        this.actions.run &&
        !this.actions.left &&
        !this.actions.right &&
        !this.actions.backward &&
        !this.actions.forward &&
        this.actions.jump
      ) {
        this.player.animation = "jumping";
      }

      if (this.player.animation === "jumping" && !this.jumpOnce) {
        if (this.player.onFloor) {
          if (this.actions.run) {
            this.player.animation = "running";
          } else if (
            this.actions.forward ||
            this.actions.backward ||
            this.actions.left ||
            this.actions.right
          ) {
            this.player.animation = "walking";
          } else {
            this.player.animation = "idle";
          }
        }
      }

      this.avatar.animation.play(this.player.animation);
    } else {
      this.avatar.animation.play("idle");
    }
  }

  updateCameraPosition() {
    if (
      this.player.animation !== "idle" &&
      this.player.animation !== "dancing"
    ) {
      const cameraAngleFromPlayer = this.camera.thirdPerson
        ? Math.atan2(
            this.player.body.position.x - this.avatar.avatar.position.x,
            this.player.body.position.z - this.avatar.avatar.position.z
          )
        : this.camera.perspectiveCamera.rotation.y;

      this.targetRotation.setFromAxisAngle(
        this.upVector,
        cameraAngleFromPlayer + this.player.directionOffset
      );
      this.avatar.avatar.quaternion.rotateTowards(this.targetRotation, 0.15);
    }
  }

  update() {
    if (this.avatar && this.time.delta < 0.1) {
      this.updateColliderMovement();
      this.updateAvatarPosition();
      this.updateAvatarRotation();
      this.updateAvatarAnimation();
      this.updateCameraPosition();
      this.updateOtherPlayers();
    }
  }
}
