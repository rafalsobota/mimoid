import { Plane, useTexture } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { useEffect } from "react";
import { Vector3 } from "three";
import * as THREE from "three";

type FloorProps = {
  onClick?: (point: Vector3) => void;
};

const Floor = ({ onClick }: FloorProps) => {
  // const [balls, setBalls] = useState<Vector3[]>([]);
  const texture = useTexture(
    "/assets/Alien/PolygonSciFiSpace_Texture_01_A.jpg"
  );

  const onClickHandler = (e: ThreeEvent<MouseEvent>) => {
    if (onClick) {
      if (e.delta < 2) {
        onClick(e.point);
      }
    }
  };

  useEffect(() => {
    texture.repeat.x = 5;
    texture.repeat.y = 5;
    texture.wrapS = THREE.MirroredRepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.needsUpdate = true;
  }, [texture]);

  return (
    <>
      <Plane
        args={[30, 30, 30, 30]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={onClickHandler}
        // onPointerDown={onPointerDown}
        // onPointerUp={onPointerUp}
      >
        <meshBasicMaterial attach="material" color="cyan" wireframe />
      </Plane>
      {/* {balls.map((ball, index) => (
        <Sphere key={index} args={[0.2, 32, 32]} position={ball}>
          <meshBasicMaterial attach="material" color="blue" />
        </Sphere>
      ))} */}
    </>
  );
};

export default Floor;
