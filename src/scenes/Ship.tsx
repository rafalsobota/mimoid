import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls, Sky } from "@react-three/drei";
import Character from "../assets/Character";
import Floor from "../assets/Floor";
import Alien from "../assets/Alien";

const Ship = () => {
  const [moveTarget, setMoveTarget] = useState(new THREE.Vector3(0, 0, 0));

  return (
    <Canvas>
      <OrbitControls />
      <ambientLight />
      {/* <pointLight position={[10, 10, -10]} power={10} /> */}
      <Floor onClick={setMoveTarget} />
      {/* <Box /> */}
      <Alien position={new THREE.Vector3(0, 0, 0)} moveTarget={moveTarget} />
      <Sky />
    </Canvas>
  );
};

export default Ship;
