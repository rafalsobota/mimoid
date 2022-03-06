import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import * as THREE from "three";
import Floor from "../assets/Floor";
import Alien from "../assets/Alien";
import Space from "../assets/Space";

const Ship = () => {
  const [moveTarget, setMoveTarget] = useState(new THREE.Vector3(0, 0, 0));

  return (
    <Canvas>
      <ambientLight />
      <Floor onClick={setMoveTarget} />
      <Alien position={new THREE.Vector3(0, 0, 0)} moveTarget={moveTarget} />
      <Space />
    </Canvas>
  );
};

export default Ship;
