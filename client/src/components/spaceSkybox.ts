import { Scene } from "three";
import { CubeTextureLoader } from "three/src/loaders/CubeTextureLoader";

export function addSpaceSkybox(scene: Scene) {
  const loader = new CubeTextureLoader();
    // The CubeTextureLoader load method takes an array of urls representing all 6 sides of the cube.
    const texture = loader.load([
      "/assets/Space/PolygonSciFiSpace_Skybox_01_Right.png",
      "/assets/Space/PolygonSciFiSpace_Skybox_01_Left.png",
      "/assets/Space/PolygonSciFiSpace_Skybox_01_Up.png",
      "/assets/Space/PolygonSciFiSpace_Skybox_01_Down.png",
      "/assets/Space/PolygonSciFiSpace_Skybox_01_Back.png",
      "/assets/Space/PolygonSciFiSpace_Skybox_01_Front.png",
    ]);

    // Set the scene background property to the resulting texture.
    scene.background = texture;
}