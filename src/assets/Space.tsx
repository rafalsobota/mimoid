import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { CubeTextureLoader } from "three";

const Space = () => {
  const { scene } = useThree();

  useEffect(() => {
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
  }, [scene]);

  return null;
};

export default Space;
