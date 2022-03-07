import { Canvas } from "@react-three/fiber";
import { useMemo, useState } from "react";
import * as THREE from "three";
import Floor from "../assets/Floor";
import Alien from "../assets/Alien";
import Space from "../assets/Space";

const Ship = () => {
  const [moveTarget, setMoveTarget] = useState(new THREE.Vector3(0, 0, 0));

  const playerPosition = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const enemyPosition = useMemo(() => new THREE.Vector3(3, 0, 0), []);

  return (
    <Canvas dpr={window.devicePixelRatio} mode="concurrent">
      <ambientLight />
      <hemisphereLight args={["#f08fff", "#99e3e2"]} />
      <Floor onClick={setMoveTarget} />
      {/* <OrbitControls /> */}
      <Alien
        key="enemy"
        name="enemy"
        position={enemyPosition}
        moveTarget={enemyPosition}
      />
      <Alien
        key="player"
        name="player"
        position={playerPosition}
        moveTarget={moveTarget}
        defaultCamera
      />
      <Space />
    </Canvas>
  );
};

export default Ship;
