import { shopifyBuy } from "/shopifyBuy.js";
import Experience from "./Experience/Experience";

import "/index.scss";
const modal = document.getElementById("modal");
const modalBackdrop = document.getElementById("modalBackdrop");
const closeModal = document.getElementById("xCloseBtn");
const viewPhoto = document.getElementById("viewPhoto");
const view3dModel = document.getElementById("view3dModel");
const crosshair = document.querySelector(".crosshair");
const productImageContainer = document.getElementById("productImageContainer");
const experience = new Experience();
let pointerPreviouslyLocked = false;
let carousel, carouselInner, prevSlide, nextSlide;

function initializeCarousel() {
  productImageContainer.innerHTML = `
      <div class="carousel">
        <div class="carousel-inner" id="carousel-inner">
          
        </div>
        <div class="carousel-controls">
          <button id="prevSlide">❮</button>
          <button id="nextSlide">❯</button>
        </div>
      </div>
    `;

  carousel = document.getElementById("carousel");
  carouselInner = document.querySelector(".carousel-inner");
  prevSlide = document.getElementById("prevSlide");
  nextSlide = document.getElementById("nextSlide");

  prevSlide.addEventListener("click", onPrevSlide);
  nextSlide.addEventListener("click", onNextSlide);
  prevSlide.addEventListener("touchstart", onPrevSlide);
  nextSlide.addEventListener("touchstart", onNextSlide);

  shopifyBuy.renderImages();
}

initializeCarousel();

let currentIndex = 0;

function onPointerLockChange() {
  if (document.pointerLockElement === null) {
    document.body.classList.add("modal-open");
  } else {
    document.body.classList.remove("modal-open");
  }
}

document.addEventListener("pointerlockchange", onPointerLockChange, false);

function showModal(productId) {
  if (document.pointerLockElement) {
    pointerPreviouslyLocked = true;
    console.log('here');
    document.exitPointerLock();
  }
  shopifyBuy.fetchProduct("gid://shopify/Product/" + productId);

  modal.style.display = "flex";
  modalBackdrop.style.display = "block";
  crosshair.classList.add("hidden");
  document.body.classList.add("modal-open");

  if (window.mobileAndTabletCheck()) {
    const gamepad = document.querySelector("#gamepad-overlay");
    gamepad.style.display = "none";
  }
}
function onCloseModal() {
  modal.style.display = "none";
  modalBackdrop.style.display = "none";
  document.body.classList.remove("modal-open");
  if(!experience.camera.thirdPerson) crosshair.classList.remove("hidden");
  onViewPhoto();
  // Request pointer lock if not on mobile
  if (!window.mobileAndTabletCheck() && pointerPreviouslyLocked) {
    document.querySelector(".experience-canvas").requestPointerLock();
    pointerPreviouslyLocked = false;
  } else if (window.mobileAndTabletCheck()){
    // Ensure the joystick is visible on mobile
    const gamepad = document.querySelector("#gamepad-overlay");
    gamepad.style.display = "block";
  }
}

const viewPhotoButton = document.getElementById("viewPhoto");

function onViewPhoto() {
  initializeCarousel();
}

function handleKeydown(event) {
  if (event.key === "q") {
    onCloseModal();
  } else if (event.key === "t") {
    onViewPhoto();
  } else if (event.key === "z") {
    onNextSlide();
  } else if (event.key === "x") {
    onPrevSlide();
  }
}

function updateCarousel() {
  const totalSlides = carouselInner.children.length;
  carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
}

function onPrevSlide() {
  if (currentIndex > 0) {
    currentIndex--;
  } else {
    currentIndex = carouselInner.children.length - 1;
  }
  updateCarousel();
}

function onNextSlide() {
  if (currentIndex < carouselInner.children.length - 1) {
    currentIndex++;
  } else {
    currentIndex = 0;
  }
  updateCarousel();
}

closeModal.addEventListener("pointerdown", onCloseModal);
viewPhoto.addEventListener("pointerdown", onViewPhoto);
document.addEventListener("keydown", handleKeydown);

window.showModal = showModal;
