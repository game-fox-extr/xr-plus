import * as THREE from "three";
import Experience from "../../../Experience.js";

export default class Interactions {
    constructor(
        positions = [
            { x: 5.780301094055176, y: -0.2, z: -20.548160552978516 },
            { x: 7.780301094055176, y: -0.2, z: -20.548160552978516 },
            { x: 9.780301094055176, y: -0.2, z: -20.548160552978516 },
            { x:  1.780301094055176, y: -0.2, z: 36.048160552978516 },
            { x: -3.780301094055176, y: -0.2, z: 36.048160552978516 },
        ],
        scale = { x: 1.5, y: 1.5, z: 1.5 }
    ) {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.positions = positions;
        this.scale = scale;

        this.clock = new THREE.Clock();

        this.init();
        this.setMaterials();
        this.setPositions();
        this.setScale();
        this.addLighting(); // Ensure there's lighting in the scene
    }

    init() {
        this.interactions = [
            this.resources.items.interactions1.scene,
            this.resources.items.interactions2.scene,
            this.resources.items.interactions3.scene,
            this.resources.items.interactions4.scene,
            this.resources.items.interactions5.scene            
        ];
    }

    setMaterials() {
        this.interactions.forEach((interaction) => {
            this.scene.add(interaction);
        });
    }

    setPositions() {
        this.interactions.forEach((interaction, index) => {
            const position = this.positions[index] || { x: 0, y: 0, z: 0 };
            interaction.position.set(position.x, position.y, position.z);
        });
    }

    setScale() {
        this.interactions.forEach((interaction, index) => {
            if (index === 2) { // If the current interaction is interaction3 (0-based index)
                interaction.scale.set(1.2, 1.2, 1.2);
            } else {
                interaction.scale.set(this.scale.x, this.scale.y, this.scale.z);
            }
        });
    }

    addLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7.5);
        this.scene.add(directionalLight);
    }

    update() {
        // Floating effect for interactions 4 and 5
        const elapsedTime = this.clock.getElapsedTime();
        const floatHeight = 0.2;
        const floatSpeed = 2;

        this.interactions[3].position.y = this.positions[3].y + Math.sin(elapsedTime * floatSpeed) * floatHeight;
        this.interactions[4].position.y = this.positions[4].y + Math.sin(elapsedTime * floatSpeed) * floatHeight;
    }
}

