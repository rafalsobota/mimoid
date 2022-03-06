import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import * as THREE from "three";
import { Sky } from "@react-three/drei";
import Floor from "../assets/Floor";
import Alien from "../assets/Alien";

const Ship = () => {
  const [moveTarget, setMoveTarget] = useState(new THREE.Vector3(0, 0, 0));

  return (
    <Canvas>
      <ambientLight />
      <Floor onClick={setMoveTarget} />
      <Alien position={new THREE.Vector3(0, 0, 0)} moveTarget={moveTarget} />
      <Sky />
    </Canvas>
  );
};

export default Ship;
