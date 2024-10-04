import * as THREE from "three";
import Experience from "./Experience.js";
import { OrbitControls } from "../Experience/Utils/CustomOrbitControls.js";

export default class Camera {
    constructor() {
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.params = {
            fov: 75,
            aspect: this.sizes.aspect,
            near: 1,
            far: 1000,
        };
        this.controls = null;
        this.setPerspectiveCamera();
        this.setOrbitControls();
        this.storedRotation = new THREE.Vector3(0, Math.PI/2, 0);
        this.thirdPersonOffset = new THREE.Vector3(17.8838, 1.2 + 10, -3.72508);
        this.thirdPerson = false;
    }

    setPerspectiveCamera() {
        this.perspectiveCamera = new THREE.PerspectiveCamera(
            this.params.fov,
            this.params.aspect,
            this.params.near,
            this.params.far
        );

        this.perspectiveCamera.position.set(0, 0, 0);
        this.perspectiveCamera.rotation.y = Math.PI / 2;
        this.scene.add(this.perspectiveCamera);
    }

    setOrbitControls() {
        this.controls = new OrbitControls(this.perspectiveCamera, this.canvas);
        this.controls.enableDamping = true;
        // this.controls.enableZoom = true;
        this.controls.enablePan = false;
        this.controls.enableRotate = false;
        this.controls.enableZoom = false;
        // this.controls.maxPolarAngle = Math.PI / 2;
        // this.controls.minDistance = 0.1;
        this.controls.maxDistance = 6;
        this.controls.dampingFactor = 0.1;
    }

    enableThirdPerson(){
        if(this.thirdPerson) return;
        this.thirdPerson = true;
        const currentPosition = this.perspectiveCamera.position;
        this.storedRotation = this.perspectiveCamera.rotation;
        currentPosition.add(this.thirdPersonOffset);
        this.controls.enabled = true;
        this.controls.enableRotate = true;
        this.controls.enableZoom = true;
        this.perspectiveCamera.rotation.set(0, Math.PI/2, 0);
    }

    disableThirdPerson(){
        this.thirdPerson = false;
        this.controls.enableRotate = false;
        this.controls.enableZoom = false;
        this.controls.enabled = false;
        this.perspectiveCamera.rotation.y = Math.PI / 2;
        this.perspectiveCamera.position.set(this.controls.target.x, this.controls.target.y,this.controls.target.z);
        this.perspectiveCamera.rotation.set(0, Math.PI/2, 0);
    }




    enableOrbitControls() {
        this.controls.enabled = true;
    }

    disableOrbitControls() {
        this.controls.enabled = false;
    }

    onResize() {
        this.perspectiveCamera.aspect = this.sizes.aspect;
        this.perspectiveCamera.updateProjectionMatrix();
    }

    update() {
        if (!this.controls) return;
        if (this.controls.enabled === true) {
            this.controls.update();
        }
    }
}
