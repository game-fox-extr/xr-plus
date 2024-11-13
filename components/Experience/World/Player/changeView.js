export default function (isThirdPerson, requestPointerLock) {
  const canvas = document.querySelector(".experience-canvas");
  const crosshair = document.querySelector(".crosshair");
  if (!isThirdPerson) {
    document.exitPointerLock();
    canvas.removeEventListener("pointerdown", requestPointerLock);
  } else {
    canvas.addEventListener("pointerdown", requestPointerLock);
  }
  canvas.classList.toggle("grab");
  crosshair.classList.toggle("hidden");
}
