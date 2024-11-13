import * as THREE from "three";
import Experience from "../../../Experience.js";

export default class Environment {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        this.init();
    }

    init() {
        this.skyBoxTexture = this.resources.items.skyBoxTexture;
        this.skyBoxTexture.encoding = THREE.sRGBEncoding;
        this.scene.background = this.skyBoxTexture;
    }


}
