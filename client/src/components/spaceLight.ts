import * as THREE from "three";

export function addSpaceLight(scene: THREE.Scene) {
  const ambientLight = new THREE.AmbientLight();
  ambientLight.color = new THREE.Color(0xb9d5ff);
  ambientLight.intensity = 1;
  // const ambientGui = gui.addFolder("Ambient Light");
  // ambientGui.add(ambientLight, "intensity", 0, 1).step(0.01);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight();
  directionalLight.color = new THREE.Color(0xb9d5ff);
  directionalLight.intensity = 0.12;
  directionalLight.position.set(1, 1, 0);
  // directionalLight.shadow.radius = 10;
  // const directionalGui = gui.addFolder("Directional Light");
  // directionalGui.add(directionalLight, "intensity", 0, 1).step(0.01);
  scene.add(directionalLight);
}